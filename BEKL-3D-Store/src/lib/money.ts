const pounds = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
})

export function formatEgp(value: number) {
  return pounds.format(value)
}
