import { useCalculator } from "../hooks/use-calculator";
import { cn } from "../lib/utils";

export default function Calculator() {
  const {
    currentOperand,
    previousOperand,
    operation,
    appendNumber,
    chooseOperation,
    clear,
    deleteNumber,
    evaluate,
    error,
  } = useCalculator();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div 
        className="w-full max-w-[340px] bg-card rounded-3xl p-6 shadow-2xl border border-card-border overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
        data-testid="calculator-container"
      >
        {/* Display Area */}
        <div 
          className="bg-[#c2cbbd] rounded-xl p-4 mb-6 text-right flex flex-col justify-end min-h-[100px] border-4 border-[#aab5a6]/30 relative overflow-hidden"
          style={{
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.15)'
          }}
          data-testid="display-area"
        >
          {/* Subtle noise texture over display */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
          
          <div 
            className="text-black/60 text-sm font-mono h-6 mb-1 tracking-widest break-words"
            data-testid="text-previous-operand"
          >
            {previousOperand} {operation}
          </div>
          <div 
            className={cn(
              "text-black font-mono text-4xl leading-none font-bold tracking-tight truncate",
              error && "text-red-700"
            )}
            data-testid="text-current-operand"
          >
            {currentOperand}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {/* Row 1 */}
          <CalcButton 
            variant="destructive" 
            onClick={clear} 
            testId="button-clear"
          >
            C
          </CalcButton>
          <CalcButton 
            variant="muted" 
            onClick={deleteNumber} 
            testId="button-delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="m21 4-10 0a2 2 0 0 0-1.61.8l-5.04 6.72a1 1 0 0 0 0 1.22l5.04 6.46a2 2 0 0 0 1.61.8l10 0a2 2 0 0 0 2-2l0-12a2 2 0 0 0-2-2z"/><path d="m16 10-4 4"/><path d="m12 10 4 4"/></svg>
          </CalcButton>
          <CalcButton 
            variant="muted" 
            onClick={() => chooseOperation("÷")} 
            testId="button-divide"
          >
            ÷
          </CalcButton>
          <CalcButton 
            variant="muted" 
            onClick={() => chooseOperation("x")} 
            testId="button-multiply"
          >
            ×
          </CalcButton>

          {/* Row 2 */}
          <CalcButton onClick={() => appendNumber("7")} testId="button-7">7</CalcButton>
          <CalcButton onClick={() => appendNumber("8")} testId="button-8">8</CalcButton>
          <CalcButton onClick={() => appendNumber("9")} testId="button-9">9</CalcButton>
          <CalcButton 
            variant="muted" 
            onClick={() => chooseOperation("-")} 
            testId="button-subtract"
          >
            -
          </CalcButton>

          {/* Row 3 */}
          <CalcButton onClick={() => appendNumber("4")} testId="button-4">4</CalcButton>
          <CalcButton onClick={() => appendNumber("5")} testId="button-5">5</CalcButton>
          <CalcButton onClick={() => appendNumber("6")} testId="button-6">6</CalcButton>
          <CalcButton 
            variant="muted" 
            onClick={() => chooseOperation("+")} 
            testId="button-add"
          >
            +
          </CalcButton>

          {/* Row 4 */}
          <CalcButton onClick={() => appendNumber("1")} testId="button-1">1</CalcButton>
          <CalcButton onClick={() => appendNumber("2")} testId="button-2">2</CalcButton>
          <CalcButton onClick={() => appendNumber("3")} testId="button-3">3</CalcButton>
          <CalcButton 
            variant="primary" 
            className="row-span-2 h-auto" 
            onClick={evaluate} 
            testId="button-equals"
          >
            =
          </CalcButton>

          {/* Row 5 */}
          <CalcButton 
            className="col-span-2 w-full text-left pl-6" 
            onClick={() => appendNumber("0")} 
            testId="button-0"
          >
            0
          </CalcButton>
          <CalcButton onClick={() => appendNumber(".")} testId="button-decimal">.</CalcButton>
        </div>
      </div>
    </div>
  );
}

interface CalcButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "muted" | "primary" | "destructive";
  testId?: string;
}

function CalcButton({ 
  children, 
  variant = "default", 
  className, 
  testId,
  ...props 
}: CalcButtonProps) {
  
  const baseStyles = "relative flex items-center justify-center font-sans font-medium text-xl sm:text-2xl rounded-xl transition-all duration-100 active:scale-95 h-14 sm:h-16 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none overflow-hidden hover-elevate";
  
  const variants = {
    default: "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_rgb(200,200,200),0_8px_10px_rgba(0,0,0,0.1)] active:shadow-[0_0px_0_0_rgb(200,200,200),0_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1",
    muted: "bg-muted text-muted-foreground shadow-[0_4px_0_0_rgb(30,30,30),0_8px_10px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_0_rgb(30,30,30),0_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 text-2xl font-normal",
    primary: "bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(15,100%,40%),0_8px_10px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_0_hsl(15,100%,40%),0_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 text-3xl font-light",
    destructive: "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_hsl(0,80%,40%),0_8px_10px_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_0_hsl(0,80%,40%),0_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      data-testid={testId}
      {...props}
    >
      {/* Subtle top highlight for physical feel */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />
      {children}
    </button>
  );
}