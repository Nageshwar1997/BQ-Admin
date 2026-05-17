import { Icon } from '@iconify/react';
import type { CSSProperties, ReactNode } from 'react';

export type StepperStep = {
  title: string;
  description?: string;
  icon?: string;
};

interface StepperProps {
  steps: StepperStep[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  children?: ReactNode;
}

const Stepper = ({ steps, activeStep, onStepClick, className = '', children }: StepperProps) => {
  const currentStep = Math.min(Math.max(activeStep, 0), Math.max(steps.length - 1, 0));

  return (
    <section
      className={`border-primary/10 bg-smoke-eerie flex w-full flex-col gap-6 rounded-xl border p-4 shadow-sm sm:p-5 lg:p-6 ${className}`}
    >
      <div
        style={{ '--steps-count': steps.length } as CSSProperties}
        className="flex flex-col gap-4 md:grid md:grid-cols-[repeat(var(--steps-count),minmax(0,1fr))] md:gap-0"
      >
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;
          const clickable = !!onStepClick;

          return (
            <button
              key={step.title}
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(index)}
              className={`group relative flex min-w-0 items-start gap-3 text-left outline-hidden transition-colors md:flex-col md:items-center md:gap-3 md:px-2 ${
                clickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {index > 0 && (
                <span
                  className={`absolute top-5 left-5 h-[calc(100%+1rem)] w-px -translate-x-1/2 md:top-5 md:right-1/2 md:left-auto md:h-px md:w-full md:-translate-x-5 ${
                    completed || active ? 'bg-blue-crayola-c' : 'bg-primary/10'
                  }`}
                />
              )}

              <span
                className={`relative z-1 flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 md:size-11 ${
                  completed
                    ? 'border-blue-crayola-c bg-accent-duo text-white shadow-[0_8px_24px_rgba(var(--blue-crayola-c-rgb),0.28)]'
                    : active
                      ? 'border-blue-crayola-c bg-primary-invert text-primary shadow-[0_0_0_5px_rgba(var(--blue-crayola-c-rgb),0.12)]'
                      : 'border-primary/10 bg-primary-invert text-primary/40'
                }`}
              >
                {completed ? (
                  <Icon icon="solar:check-read-linear" className="size-5" />
                ) : step.icon ? (
                  <Icon icon={step.icon} className="size-5" />
                ) : (
                  index + 1
                )}
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5 md:items-center md:pt-0 md:text-center">
                <span
                  className={`line-clamp-1 text-sm font-semibold md:text-[13px] lg:text-sm ${
                    active ? 'text-primary' : completed ? 'text-primary/80' : 'text-primary/45'
                  }`}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span
                    className={`line-clamp-2 text-xs leading-4 ${
                      active ? 'text-secondary' : 'text-primary/35'
                    }`}
                  >
                    {step.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {children && <div className="border-primary/10 border-t pt-5">{children}</div>}
    </section>
  );
};

export default Stepper;
