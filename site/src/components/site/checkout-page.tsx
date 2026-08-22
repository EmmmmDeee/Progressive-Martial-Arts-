"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { useRouter, RouteLink } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCart, type CartItem } from "@/lib/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AU_STATES = [
  { value: "QLD", label: "Queensland" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "TAS", label: "Tasmania" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

type ShippingMethod = "standard" | "pickup" | "free";

const SHIPPING_STANDARD = 9.95;
const SHIPPING_FREE_THRESHOLD = 100;

type FormState = {
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  // Mock payment
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function maskCard(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function maskCvc(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function CheckoutPage() {
  const { navigate } = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const remove = useCart((s) => s.remove);
  const updateQty = useCart((s) => s.updateQty);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [form, setForm] = useState<FormState>({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  // Auto-pick shipping based on subtotal
  useEffect(() => {
    if (subtotal >= SHIPPING_FREE_THRESHOLD && shipping === "standard") {
      setShipping("free");
    }
  }, [subtotal, shipping]);

  const shippingCost = useMemo(() => {
    if (shipping === "pickup") return 0;
    if (shipping === "free") return 0;
    if (subtotal >= SHIPPING_FREE_THRESHOLD) return 0;
    return SHIPPING_STANDARD;
  }, [shipping, subtotal]);

  const total = subtotal + shippingCost;

  // Redirect to shop if cart is empty (after mount)
  useEffect(() => {
    if (mounted && items.length === 0) {
      toast.info("Your cart is empty. Browse the shop first.");
      navigate({ name: "shop" });
    }
  }, [mounted, items.length, navigate]);

  const setField = (k: keyof FormState, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.name || form.name.trim().length < 2) e.name = "Enter your full name";
    if (!form.phone) e.phone = "Phone number is required";
    if (shipping !== "pickup") {
      if (!form.address) e.address = "Address is required";
      if (!form.city) e.city = "City is required";
      if (!form.state) e.state = "State is required";
      if (!form.postcode) e.postcode = "Postcode is required";
      else if (!/^\d{4,5}$/.test(form.postcode))
        e.postcode = "Enter a valid postcode";
    }
    // Mock payment
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Enter a valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = "MM/YY";
    if (form.cardCvc.length < 3) e.cardCvc = "3-4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) {
      toast.error("Please complete the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        name: form.name,
        phone: form.phone,
        address: shipping === "pickup" ? "Pickup in store" : form.address,
        city: shipping === "pickup" ? "Tingalpa" : form.city,
        postcode: shipping === "pickup" ? "4173" : form.postcode,
        state: shipping === "pickup" ? "QLD" : form.state,
        country: "Australia",
        items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            slug: i.slug,
            name: i.name,
            price: i.price,
            image: i.image,
            size: i.size,
            qty: i.qty,
          }))
        ),
        subtotal,
        shipping: shippingCost,
        total,
        notes: shipping === "pickup" ? "Pick up in store" : undefined,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to place order");
      }
      clear();
      toast.success("Order placed!");
      navigate({ name: "order-success", id: json.data.id });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return null; // redirect in flight
  }

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-foreground/50 flex-wrap"
          >
            <RouteLink
              to={{ name: "home" }}
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Home className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <RouteLink to={{ name: "shop" }} className="hover:text-accent transition-colors">
              Shop
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <RouteLink to={{ name: "cart" }} className="hover:text-accent transition-colors">
              Cart
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <span className="text-foreground/80 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">
            <span className="h-px w-8 bg-primary" />
            Checkout
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight">
            Complete your <span className="text-gradient-gold">order</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form column */}
          <div className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  1
                </span>
                Contact details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Email"
                  required
                  error={errors.email}
                  className="sm:col-span-2"
                >
                  <Input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                  />
                </Field>
                <Field label="Full name" required error={errors.name}>
                  <Input
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="0412 345 678"
                    aria-invalid={!!errors.phone}
                  />
                </Field>
              </div>
            </section>

            {/* Shipping address */}
            <section>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  2
                </span>
                Shipping
              </h2>
              <RadioGroup
                value={shipping}
                onValueChange={(v) => setShipping(v as ShippingMethod)}
                className="grid gap-3 mb-5"
              >
                <ShippingOption
                  value="standard"
                  title="Standard shipping"
                  desc="Australia-wide, 3–7 business days"
                  price={
                    subtotal >= SHIPPING_FREE_THRESHOLD
                      ? "Free"
                      : `$${SHIPPING_STANDARD.toFixed(2)}`
                  }
                />
                <ShippingOption
                  value="free"
                  title="Free shipping"
                  desc={`On orders over $${SHIPPING_FREE_THRESHOLD}`}
                  price={
                    subtotal >= SHIPPING_FREE_THRESHOLD ? "Unlocked" : "Locked"
                  }
                  disabled={subtotal < SHIPPING_FREE_THRESHOLD}
                />
                <ShippingOption
                  value="pickup"
                  title="Pick up in store"
                  desc="180 New Cleveland Rd, Tingalpa QLD"
                  price="Free"
                />
              </RadioGroup>

              {shipping !== "pickup" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Street address"
                    required
                    error={errors.address}
                    className="sm:col-span-2"
                  >
                    <Input
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      placeholder="180 New Cleveland Rd"
                      aria-invalid={!!errors.address}
                    />
                  </Field>
                  <Field label="City" required error={errors.city}>
                    <Input
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="Tingalpa"
                      aria-invalid={!!errors.city}
                    />
                  </Field>
                  <Field label="State" required error={errors.state}>
                    <Select
                      value={form.state}
                      onValueChange={(v) => setField("state", v)}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-label="Select state"
                        aria-invalid={!!errors.state}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {AU_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field
                    label="Postcode"
                    required
                    error={errors.postcode}
                    className="sm:col-span-2"
                  >
                    <Input
                      autoComplete="postal-code"
                      value={form.postcode}
                      onChange={(e) => setField("postcode", e.target.value)}
                      placeholder="4173"
                      inputMode="numeric"
                      aria-invalid={!!errors.postcode}
                    />
                  </Field>
                </div>
              )}

              {shipping === "pickup" && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm text-foreground/80 flex items-start gap-3">
                  <Store className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Pick up at PMAAI Academy.
                    </span>{" "}
                    180 New Cleveland Rd, Tingalpa QLD 4173. We&apos;ll email you
                    when your order is ready to collect (usually within 24 hours).
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  3
                </span>
                Payment
              </h2>
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/5 px-3 py-2 mb-4 text-xs text-yellow-500/90 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Demo only — no real payment processed. Do not enter real card details.
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Card number"
                  required
                  error={errors.cardNumber}
                  className="sm:col-span-2"
                >
                  <div className="relative">
                    <Input
                      inputMode="numeric"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setField("cardNumber", maskCard(e.target.value))
                      }
                      placeholder="4242 4242 4242 4242"
                      className="pl-10"
                      aria-invalid={!!errors.cardNumber}
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  </div>
                </Field>
                <Field label="Expiry (MM/YY)" required error={errors.cardExpiry}>
                  <Input
                    inputMode="numeric"
                    value={form.cardExpiry}
                    onChange={(e) =>
                      setField("cardExpiry", maskExpiry(e.target.value))
                    }
                    placeholder="12/27"
                    aria-invalid={!!errors.cardExpiry}
                  />
                </Field>
                <Field label="CVC" required error={errors.cardCvc}>
                  <Input
                    inputMode="numeric"
                    value={form.cardCvc}
                    onChange={(e) => setField("cardCvc", maskCvc(e.target.value))}
                    placeholder="123"
                    aria-invalid={!!errors.cardCvc}
                  />
                </Field>
              </div>
            </section>

            {/* Place order (mobile inline) */}
            <div className="lg:hidden">
              <Button
                size="lg"
                className="w-full"
                onClick={placeOrder}
                disabled={submitting}
              >
                {submitting ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>

          {/* Order summary column */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              {/* Header (desktop) */}
              <div className="hidden lg:block px-5 py-4 border-b border-border/60 bg-secondary/30">
                <h2 className="font-display text-base font-bold uppercase tracking-wide">
                  Order summary
                </h2>
              </div>

              {/* Mobile collapsible */}
              <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen} className="lg:hidden">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-5 py-4 bg-secondary/30"
                  >
                    <span className="font-display text-base font-bold uppercase tracking-wide">
                      Order summary
                    </span>
                    <span className="flex items-center gap-2 text-sm text-foreground/70">
                      ${total.toFixed(2)}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          summaryOpen && "rotate-180"
                        )}
                      />
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <OrderSummaryBody
                    items={items}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    total={total}
                    onRemove={remove}
                    onUpdateQty={updateQty}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Desktop body */}
              <div className="hidden lg:block">
                <OrderSummaryBody
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  total={total}
                  onRemove={remove}
                  onUpdateQty={updateQty}
                />
              </div>

              {/* Place order (desktop) */}
              <div className="hidden lg:block p-5 border-t border-border/60 bg-card">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={placeOrder}
                  disabled={submitting}
                >
                  {submitting ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
                </Button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-foreground/50">
                  <Lock className="h-3 w-3" />
                  Secure checkout · Demo only
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: <ShieldCheck className="h-4 w-4" />, t: "Secure checkout" },
                { icon: <Truck className="h-4 w-4" />, t: "Fast shipping" },
                { icon: <CheckCircle2 className="h-4 w-4" />, t: "Easy returns" },
              ].map((i) => (
                <div
                  key={i.t}
                  className="rounded-lg border border-border/60 bg-card/50 p-3 flex flex-col items-center gap-1.5"
                >
                  <span className="text-accent">{i.icon}</span>
                  <span className="text-[11px] font-medium text-foreground/80 leading-tight">
                    {i.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 text-xs uppercase tracking-wider text-foreground/70">
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-primary flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

function ShippingOption({
  value,
  title,
  desc,
  price,
  disabled,
}: {
  value: string;
  title: string;
  desc: string;
  price: string;
  disabled?: boolean;
}) {
  return (
    <Label
      htmlFor={`ship-${value}`}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
        disabled
          ? "border-border/40 opacity-60 cursor-not-allowed"
          : "border-border/60 hover:border-primary/40"
      )}
    >
      <RadioGroupItem id={`ship-${value}`} value={value} disabled={disabled} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-sm font-semibold text-primary">{price}</span>
        </div>
        <p className="text-xs text-foreground/60 mt-0.5">{desc}</p>
      </div>
    </Label>
  );
}

function OrderSummaryBody({
  items,
  subtotal,
  shippingCost,
  total,
  onRemove,
  onUpdateQty,
}: {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onRemove: (id: string, size?: string) => void;
  onUpdateQty: (id: string, size: string | undefined, qty: number) => void;
}) {
  return (
    <div className="p-5">
      <ul className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin pr-1">
        {items.map((item, idx) => (
          <li
            key={`${item.productId}-${item.size || ""}-${idx}`}
            className="flex gap-3"
          >
            <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border border-border/60 bg-secondary/40">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-medium text-foreground leading-snug line-clamp-2">
                  {item.name}
                </h3>
                <button
                  type="button"
                  onClick={() => onRemove(item.productId, item.size)}
                  aria-label={`Remove ${item.name}`}
                  className="text-foreground/40 hover:text-primary transition-colors p-0.5 -m-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {item.size && (
                <div className="text-[10px] uppercase tracking-wider text-foreground/50 mt-0.5">
                  Size: <span className="text-foreground/80 font-medium">{item.size}</span>
                </div>
              )}
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="inline-flex items-center rounded border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, item.size, item.qty - 1)}
                    disabled={item.qty <= 1}
                    aria-label={`Decrease ${item.name}`}
                    className="h-6 w-6 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="h-6 w-7 inline-flex items-center justify-center text-[11px] font-semibold">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, item.size, item.qty + 1)}
                    disabled={item.qty >= 99}
                    aria-label={`Increase ${item.name}`}
                    className="h-6 w-6 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-foreground/70">
          <span>Subtotal</span>
          <span className="text-foreground font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-foreground/70">
          <span>Shipping</span>
          <span className="text-foreground font-medium">
            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <span className="font-display text-base font-bold uppercase">Total</span>
        <span className="font-display text-xl font-bold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-foreground/50">
        AUD · Inclusive of GST
      </p>
    </div>
  );
}
