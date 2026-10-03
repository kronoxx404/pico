
export const plans = [
  {
    id: '1',
    name: '1 Día',
    price: 87900,
    label: '1 Día — $ 87.900',
    description: 'Exención para circular un día completo. Válida de 6:00 AM a 9:00 PM.'
  },
  {
    id: '2',
    name: '1 Mes',
    price: 702300,
    label: '1 Mes — $ 702,300',
    description: 'Exención de lunes a viernes durante un mes completo.'
  },
  {
    id: '3',
    name: '6 Meses',
    price: 3511600,
    label: '6 Meses — $ 3,511,600',
    description: 'Exención total durante un semestre. La opción más conveniente para uso frecuente.'
  }
]

export function getPlanPrice(planId: string): number {
  const plan = plans.find(p => p.id === planId)
  return plan ? plan.price : 0
}