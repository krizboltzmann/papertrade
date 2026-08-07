from decimal import Decimal, ROUND_HALF_UP

MONEY = Decimal("0.00000001")
QTY = Decimal("0.000000000001")
PRICE = Decimal("0.000000000001")


def as_decimal(value: Decimal | float | int | str) -> Decimal:
    return value if isinstance(value, Decimal) else Decimal(str(value))


def quantize_money(value: Decimal) -> Decimal:
    return as_decimal(value).quantize(MONEY, rounding=ROUND_HALF_UP)


def quantize_qty(value: Decimal) -> Decimal:
    return as_decimal(value).quantize(QTY, rounding=ROUND_HALF_UP)


def quantize_price(value: Decimal) -> Decimal:
    return as_decimal(value).quantize(PRICE, rounding=ROUND_HALF_UP)
