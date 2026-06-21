import { useState } from "react";
import { Drawer } from "vaul";
import { Check, Dumbbell } from "lucide-react";
import { useColors } from "@/hooks/useColors";
import { Exercise } from "@/lib/mock-data";

export function SubstituteExerciseSheet({
  isOpen,
  onOpenChange,
  originalExercise,
  onSubstitute,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  originalExercise: Exercise | null;
  onSubstitute: (newExerciseId: string) => void;
}) {
  const c = useColors();
  
  if (!originalExercise) return null;

  // Mock alternatives based on the original exercise
  const alternatives = [
    {
      id: `${originalExercise.id}-alt1`,
      name: `Machine ${originalExercise.name.replace("Goblet ", "")}`,
      desc: "More stability, isolates the muscle",
    },
    {
      id: `${originalExercise.id}-alt2`,
      name: `Dumbbell ${originalExercise.name}`,
      desc: "Requires more balance",
    },
    {
      id: `${originalExercise.id}-alt3`,
      name: `Bodyweight ${originalExercise.name}`,
      desc: "Focus on range of motion and form",
    },
  ];

  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-3xl flex flex-col focus:outline-none"
          style={{ background: c.appBg, borderTop: `1px solid ${c.inputBorder}` }}
        >
          <div className="p-4 rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mb-6" />
            <div className="mb-6 px-2">
              <h2 className="text-[22px] font-black" style={{ color: c.textPrimary }}>Substitute Exercise</h2>
              <p className="text-sm mt-1" style={{ color: c.textSecondary }}>
                Replace <strong>{originalExercise.name}</strong> with a similar movement.
              </p>
            </div>
            
            <div className="space-y-3 px-2 mb-6">
              {alternatives.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSubstitute(alt.id)}
                  className="w-full text-left p-4 rounded-2xl border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] flex items-center justify-between group"
                  style={{ borderColor: c.inputBorder }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full grid place-items-center" style={{ background: c.chipBg, color: c.textSecondary }}>
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-[15px]" style={{ color: c.textPrimary }}>{alt.name}</div>
                      <div className="text-[12px] font-medium mt-0.5" style={{ color: c.textTertiary }}>{alt.desc}</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: c.sunGlare, color: c.sunGlare }}>
                    <Check size={12} />
                  </div>
                </button>
              ))}
            </div>

            <div className="px-2 pb-6">
              <button
                onClick={() => onOpenChange(false)}
                className="w-full py-4 rounded-full font-bold text-[15px] transition-colors"
                style={{ color: c.textSecondary, background: c.chipBg }}
              >
                Keep original
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
