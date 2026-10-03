'use client'

import { plans } from '@/lib/utils'

interface RateCardProps {
  onSelectPlan?: (planId: string) => void
  selectedPlanId?: any
}

export default function RateCard({ onSelectPlan, selectedPlanId }: RateCardProps) {
  return (
    <section className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-2">Tarifas de Referencia</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Estos son los valores base. El precio final se calcula según las características de su vehículo.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            onClick={() => onSelectPlan?.(plan.id)}
            className={`rounded-xl border text-card-foreground shadow relative overflow-hidden transition-all duration-200 cursor-pointer hover:border-primary/50 hover:shadow-sm ${selectedPlanId === plan.id
              ? 'bg-[#10B981]/10 border-[#10B981] ring-2 ring-primary/20'
              : index === 1 ? 'bg-primary/5 border-primary/20' : 'bg-card'
              }`}
          >
            {index === 1 && (
              <div className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider ">
                Más solicitado
              </div>
            )}
            <div className="flex flex-col space-y-1.5 p-5 pb-3">
              <div className="font-semibold tracking-tight text-lg">{plan.name}</div>
              <div className="text-muted-foreground text-xs">{plan.description}</div>
            </div>
            <div className="p-5 pt-0">
              <div className="text-2xl font-bold text-foreground mt-2">
                ${plan.price.toLocaleString('es-CO')}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Tarifa base — puede variar</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}