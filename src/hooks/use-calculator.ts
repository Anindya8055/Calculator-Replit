import { useState, useCallback, useEffect } from "react";

export function useCalculator() {
  const [currentOperand, setCurrentOperand] = useState("0");
  const [previousOperand, setPreviousOperand] = useState("");
  const [operation, setOperation] = useState("");
  const [overwrite, setOverwrite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = useCallback(() => {
    setCurrentOperand("0");
    setPreviousOperand("");
    setOperation("");
    setOverwrite(false);
    setError(null);
  }, []);

  const deleteNumber = useCallback(() => {
    if (overwrite) {
      setCurrentOperand("0");
      setOverwrite(false);
      return;
    }
    if (currentOperand.length === 1) {
      setCurrentOperand("0");
      return;
    }
    setCurrentOperand((prev) => prev.slice(0, -1));
  }, [overwrite, currentOperand]);

  const appendNumber = useCallback(
    (number: string) => {
      if (error) clear();
      if (number === "." && currentOperand.includes(".")) return;
      if (overwrite) {
        setCurrentOperand(number === "." ? "0." : number);
        setOverwrite(false);
        return;
      }
      if (currentOperand === "0" && number !== ".") {
        setCurrentOperand(number);
        return;
      }
      if (currentOperand.length > 15) return; // Prevent excessively long numbers
      setCurrentOperand((prev) => prev + number);
    },
    [currentOperand, overwrite, error, clear]
  );

  const compute = useCallback(
    (prev: string, current: string, op: string) => {
      const prevNum = parseFloat(prev);
      const currentNum = parseFloat(current);
      if (isNaN(prevNum) || isNaN(currentNum)) return "";

      let computation = 0;
      switch (op) {
        case "+":
          computation = prevNum + currentNum;
          break;
        case "-":
          computation = prevNum - currentNum;
          break;
        case "*":
        case "x":
          computation = prevNum * currentNum;
          break;
        case "÷":
        case "/":
          if (currentNum === 0) {
            return "Error";
          }
          computation = prevNum / currentNum;
          break;
        default:
          return "";
      }

      // Format to avoid long floating point precision errors
      const resultString = computation.toString();
      if (resultString.length > 15) {
         return parseFloat(computation.toPrecision(12)).toString();
      }
      return resultString;
    },
    []
  );

  const chooseOperation = useCallback(
    (op: string) => {
      if (error) clear();
      if (currentOperand === "0" && previousOperand === "") {
         if (op === "-") {
             // Handle leading negative
             appendNumber("-");
             return;
         }
      }
      if (currentOperand === "" || currentOperand === "-") return;
      
      const normalizedOp = op === "*" ? "x" : op === "/" ? "÷" : op;

      if (previousOperand !== "") {
        const result = compute(previousOperand, currentOperand, operation);
        if (result === "Error") {
          setError(result);
          setCurrentOperand("0");
          setPreviousOperand("");
          setOperation("");
          return;
        }
        setPreviousOperand(result);
      } else {
        setPreviousOperand(currentOperand);
      }
      
      setOperation(normalizedOp);
      setCurrentOperand("");
      setOverwrite(false);
    },
    [currentOperand, previousOperand, operation, compute, error, clear, appendNumber]
  );

  const evaluate = useCallback(() => {
    if (operation === "" || previousOperand === "") return;
    const result = compute(previousOperand, currentOperand || previousOperand, operation); // If pressing = without second operand, repeat the first one
    
    if (result === "Error") {
      setError(result);
      setCurrentOperand("0");
      setPreviousOperand("");
      setOperation("");
      return;
    }

    setCurrentOperand(result);
    setOperation("");
    setPreviousOperand("");
    setOverwrite(true);
  }, [currentOperand, previousOperand, operation, compute]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        appendNumber(e.key);
      } else if (e.key === ".") {
        appendNumber(".");
      } else if (e.key === "=" || e.key === "Enter") {
        e.preventDefault();
        evaluate();
      } else if (e.key === "Backspace") {
        deleteNumber();
      } else if (e.key === "Escape" || e.key === "Clear") {
        clear();
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        chooseOperation(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendNumber, chooseOperation, clear, deleteNumber, evaluate]);

  return {
    currentOperand: error || currentOperand,
    previousOperand,
    operation,
    appendNumber,
    chooseOperation,
    clear,
    deleteNumber,
    evaluate,
    error,
  };
}