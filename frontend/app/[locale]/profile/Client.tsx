"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useSession, signOut } from "next-auth/react";
import { Loader2, MapPin, Pencil, Plus, Trash2, UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/lib/profile";
import {
  type Address,
  type AddressInput,
  addAddress,
  deleteAddress,
  updateAddress,
} from "@/lib/address";

const EMPTY_ADDRESS: AddressInput = {
  name: "",
  phone: "",
  flatHouse: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
};

type ProfileUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export default function Client({
  signedIn,
  initialUser,
  initialAddresses,
}: {
  signedIn: boolean;
  initialUser: ProfileUser | null;
  initialAddresses: Address[];
}) {
  const t = useTranslations('PROFILE');
  const { data: session, update } = useSession();
  const user = initialUser;

  const [savingProfile, setSavingProfile] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressInput>(EMPTY_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
    };
    setSavingProfile(true);
    try {
      const updated = await updateProfile(payload);
      await update({
        user: {
          ...session?.user,
          first_name: updated.first_name,
          last_name: updated.last_name,
          phone: updated.phone,
        },
      });
      toast.success(t('PROFILE_UPDATED'));
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "")
          : "";
      toast.error(t('PROFILE_ERROR'), { description: message || t('PROFILE_ERROR_DESC') });
    } finally {
      setSavingProfile(false);
    }
  };

  const startEditAddress = (a: Address) => {
    setEditingId(a._id);
    setShowNewForm(false);
    setAddressForm({
      name: a.name,
      phone: a.phone,
      flatHouse: a.flatHouse,
      area: a.area,
      city: a.city,
      state: a.state,
      pinCode: a.pinCode,
    });
  };

  const startNewAddress = () => {
    setEditingId(null);
    setShowNewForm(true);
    setAddressForm({
      ...EMPTY_ADDRESS,
      name: [user?.first_name, user?.last_name].filter(Boolean).join(" "),
      phone: user?.phone ?? "",
    });
  };

  const cancelAddressForm = () => {
    setEditingId(null);
    setShowNewForm(false);
    setAddressForm(EMPTY_ADDRESS);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      if (editingId) {
        const updated = await updateAddress(editingId, addressForm);
        setAddresses((prev) => prev.map((a) => (a._id === editingId ? updated : a)));
        toast.success(t('ADDRESS_UPDATED'));
      } else {
        const created = await addAddress(addressForm);
        setAddresses((prev) => [...prev, created]);
        toast.success(t('ADDRESS_ADDED'));
      }
      cancelAddressForm();
    } catch {
      toast.error(editingId ? t('ADDRESS_UPDATE_ERROR') : t('ADDRESS_ADD_ERROR'));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm(t('DELETE_CONFIRM'))) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      if (editingId === id) cancelAddressForm();
      toast.success(t('ADDRESS_DELETED'));
    } catch {
      toast.error(t('ADDRESS_DELETE_ERROR'));
    }
  };

  if (!signedIn || !user) {
    return (
      <section className="container py-16">
        <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
        <div className="py-24 text-center">
          <UserCircle className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-6 font-serif text-2xl">{t('SIGN_IN_TITLE')}</p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href={`/login?callbackUrl=${encodeURIComponent("/profile")}`}>{t('SIGN_IN')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  const isFormOpen = showNewForm || editingId !== null;

  return (
    <section className="container py-16">
      <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xs tracking-luxe uppercase text-foreground">{t('PERSONAL')}</h2>
          <form
            key={user.id}
            onSubmit={handleSaveProfile}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name">{t('FIRST_NAME')}</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={user.first_name ?? ""}
                  required
                  className="mt-2 h-12 rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="last_name">{t('LAST_NAME')}</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={user.last_name ?? ""}
                  required
                  className="mt-2 h-12 rounded-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('EMAIL')}</Label>
              <Input
                id="email"
                type="email"
                value={user.email ?? ""}
                readOnly
                className="mt-2 h-12 rounded-none bg-secondary/40"
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('PHONE')} <span className="text-muted-foreground text-xs">({t('PHONE_OPTIONAL')})</span></Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                className="mt-2 h-12 rounded-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="luxe" size="lg" disabled={savingProfile}>
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : t('SAVE')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground"
              >
                {t('SIGN_OUT')}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xs tracking-luxe uppercase text-foreground">{t('ADDRESSES')}</h2>
            {!isFormOpen && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startNewAddress}
                className="rounded-none gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> {t('ADD_ADDRESS')}
              </Button>
            )}
          </div>

          {isFormOpen && (
            <form
              onSubmit={handleSaveAddress}
              className="mt-6 border border-border bg-background p-6 space-y-4"
            >
              <p className="text-xs tracking-luxe uppercase text-muted-foreground">
                {editingId ? t('EDIT_ADDRESS') : t('NEW_ADDRESS')}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder={t('FULL_NAME')}
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  required
                  className="h-11 rounded-none sm:col-span-2"
                />
                <Input
                  placeholder={t('PHONE_FIELD')}
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
                <Input
                  placeholder={t('POSTAL_CODE')}
                  value={addressForm.pinCode}
                  onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
                <Input
                  placeholder={t('APARTMENT')}
                  value={addressForm.flatHouse}
                  onChange={(e) => setAddressForm({ ...addressForm, flatHouse: e.target.value })}
                  required
                  className="h-11 rounded-none sm:col-span-2"
                />
                <Input
                  placeholder={t('STREET')}
                  value={addressForm.area}
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                  required
                  className="h-11 rounded-none sm:col-span-2"
                />
                <Input
                  placeholder={t('CITY')}
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
                <Input
                  placeholder={t('STATE')}
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  required
                  className="h-11 rounded-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="luxe" size="sm" disabled={savingAddress}>
                  {savingAddress ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('SAVE_ADDRESS')
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelAddressForm}
                  className="text-muted-foreground"
                >
                  {t('CANCEL')}
                </Button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !isFormOpen ? (
            <div className="mt-6 border border-dashed border-border p-8 text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">{t('NO_ADDRESSES')}</p>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {addresses.map((a) => (
                <li
                  key={a._id}
                  className="flex items-start justify-between gap-4 border border-border bg-background p-5"
                >
                  <div className="text-sm">
                    <p className="font-medium">{a.name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {a.flatHouse}, {a.area}
                    </p>
                    <p className="text-muted-foreground">
                      {a.city}, {a.state} {a.pinCode}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.phone}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditAddress(a)}
                      aria-label={t('EDIT_ADDRESS')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(a._id)}
                      aria-label={t('DELETE_ADDRESS')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
