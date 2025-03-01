export function formatCurrency(input:string){
    return new Intl.NumberFormat("sr-RS", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(input))
}
    
    