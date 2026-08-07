"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/services/api";
import { paperBuy } from "@/services/trading";
import type { PaperTradeResponse } from "@/types";

type BuyDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: PaperTradeResponse) => void;
};

type BuyFormState = {
  token_name: string;
  token_symbol: string;
  contract_address: string;
  chain: string;
  price: string;
  market_cap: string;
  amount_usd: string;
};

const INITIAL_FORM: BuyFormState = {
  token_name: "",
  token_symbol: "",
  contract_address: "",
  chain: "solana",
  price: "",
  market_cap: "",
  amount_usd: "",
};

export function BuyDialog({ open, onClose, onSuccess }: BuyDialogProps) {
  const [form, setForm] = useState<BuyFormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: keyof BuyFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    setError(null);
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const price = Number(form.price);
    const marketCap = Number(form.market_cap);
    const amountUsd = Number(form.amount_usd);

    if (!form.token_name.trim() || !form.contract_address.trim()) {
      setError("Token name and contract address are required.");
      return;
    }

    if (!(price > 0) || !(marketCap > 0) || !(amountUsd > 0)) {
      setError("Price, market cap, and amount must be greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await paperBuy({
        token_name: form.token_name.trim(),
        token_symbol: (form.token_symbol || form.token_name).trim(),
        contract_address: form.contract_address.trim(),
        chain: form.chain.trim() || "solana",
        price,
        market_cap: marketCap,
        amount_usd: amountUsd,
      });
      setForm(INITIAL_FORM);
      onSuccess(result);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Paper buy failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Paper Buy"
      description="Simulate a purchase with manually entered market data. No blockchain transaction is sent."
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          label="Token Name"
          placeholder="e.g. Pepe Coin"
          value={form.token_name}
          onChange={(event) => updateField("token_name", event.target.value)}
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Symbol"
            placeholder="PEPE"
            value={form.token_symbol}
            onChange={(event) => updateField("token_symbol", event.target.value)}
          />
          <Input
            label="Chain"
            placeholder="solana"
            value={form.chain}
            onChange={(event) => updateField("chain", event.target.value)}
          />
        </div>
        <Input
          label="Contract Address"
          placeholder="Token mint / contract"
          value={form.contract_address}
          onChange={(event) => updateField("contract_address", event.target.value)}
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00001"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            required
          />
          <Input
            label="Market Cap (USD)"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="5000000"
            value={form.market_cap}
            onChange={(event) => updateField("market_cap", event.target.value)}
            required
          />
        </div>
        <Input
          label="Amount USD"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="100"
          value={form.amount_usd}
          onChange={(event) => updateField("amount_usd", event.target.value)}
          required
        />

        {error ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Buying…" : "BUY"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
