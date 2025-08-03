let inp = document.getElementById("input");
let Result = document.getElementById("result");
let btns = document.querySelectorAll(".buttons");
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.tagName == "BUTTON") {
      let btnValue = e.target.innerText;
      if(btnValue === 'x') btnValue = '*' 
      if(btnValue === '÷') btnValue = '/'   
      handleInputValue(btnValue);
    }
  });
});


const handleInputValue = (btnValue) => {
  switch (btnValue) {
    case "=":
      calculateValue(btnValue);
      break;
    case "C":
      clearDisplay(btnValue);
      break;
    case "Del":
      removeValue(btnValue);
      break;
    case ".":
      decimalValue(btnValue);
      break;
    case "( )":
      bracketValue(btnValue);
      break;
    case "0":
      handleZero(btnValue);
      break;
    default:
      displayValue(btnValue);
      break;
  }
};


let openBracket = 0;
const bracketValue = () => {
  const lastChar = inp.value.slice(-1);
  if (openBracket === 0 || ["+", "-", "*", "/", "("].includes(lastChar)) {
    inp.value += "(";
    openBracket++;
  } else {
    inp.value += ")";
    openBracket--;
  }
  try {
    Result.value = math.evaluate(inp.value).toLocaleString('en-IN');
  } catch (error) {
    Result.value = ""; 
  }
  updateUI();
};



const decimalValue = (btnValue) => {
  let splitValues = inp.value.split(/[+/*\-]/);
  let lastValue = splitValues[splitValues.length - 1];
 try {
   if (lastValue.includes(".") && btnValue === ".") {
    return
  } 
  else if (lastValue == "" && btnValue == ".") {
    inp.value += "0.";
  } 
  else {
    inp.value += btnValue;
  }
 } 
 catch (error) {
    invalid()
  }
  updateUI()
};


const displayValue = (btnValue) => {
  let splitValues = inp.value.split(/[+/*\-]/);
  let lastValue = splitValues[splitValues.length - 1];
  let operators = ["+", "*", "/"];
  let allOperators = ["+", "-", "*", "/"];
  let lastchar = inp.value[inp.value.length - 1];

  if ((inp.value === "" || inp.value == "-") && operators.includes(btnValue)) {
    inp.value = "";
  } 
  else if (allOperators.includes(lastchar) && allOperators.includes(btnValue)) {
    return;
  } 
  else if (splitValues.length >= 2 && lastValue.length !== "") {
    inp.value += btnValue;
    Result.value = math.evaluate(inp.value).toLocaleString('en-IN')
  } 
  else {
    inp.value += btnValue;
  }
  updateUI()
};


const handleZero = (btnValue) => {
  let splitValues = inp.value.split(/[+\-*/]/);
  let lastValue = splitValues[splitValues.length - 1];

  if (lastValue === "0" && btnValue === "0") {
    return;
  }
  else if (lastValue === "0" && btnValue !== "0") {
    inp.value += btnValue;
    return;
  }
  inp.value += btnValue;
  Result.value = math.evaluate(inp.value).toLocaleString('en-IN');
  updateUI()
};


let lastExpression = "";
let flag = false;
const calculateValue = (btnValue) => {
  try {
    let lastchar = inp.value[inp.value.length - 1];
    let operators = ["+", "-", "*", "/", "."];
    if (inp.value == "") {
      inp.value = "";
    } 
    else if (operators.includes(lastchar)) {
      return;
    } 
    else if (inp.value && Result.value) {
      lastExpression = inp.value;
      let rawResult = Result.value.replace(/,/g, "");
      inp.value = rawResult;
      Result.value = "";
      flag = true;
      return
    } 
    else {
      Result.value = math.evaluate(inp.value).toLocaleString('en-IN');
    }
  } 
  catch (error) {
    invalid()
  }

  updateUI()
};


const removeValue = (btnValue) => {
  let removedChar = inp.value.slice(-1); 
  inp.value = inp.value.slice(0, -1);

  if (removedChar === "(") openBracket--;
  if (removedChar === ")") openBracket++;

  let lastchar = inp.value[inp.value.length - 1];
  let allOperators = ["+", "-", "*", "/"];
  let splitValues = inp.value.split(/[+/*\-]/);
  let lastValue = splitValues[splitValues.length - 1];

  if (splitValues.length >= 2 && lastValue.length >= 1) {
    Result.value = math.evaluate(inp.value).toLocaleString('en-IN');
  } 
  else if (allOperators.includes(lastchar)) {
    Result.value = "";
  }
  else if (flag && lastExpression) {
    inp.value = lastExpression.slice(0, -1);
    Result.value = math.evaluate(inp.value).toLocaleString('en-IN');
    flag = false;
  }
  updateUI()
};


const clearDisplay = () => {
  inp.value = "";
  Result.value = "";
  openBracket = 0
};


const inputHandling = () => {  
  if (inp.value.length >= 13) {
    inp.style.fontSize = "25px";
    inp.style.paddingRight = "6px";
    inp.style.paddingTop = "12px";
    inp.style.paddingBottom = "12px";
  } 
  else if(inp.value.length >= 10) {
    inp.style.fontSize = "30px";
  }
  else{
     inp.style.fontSize = "35px";
    inp.style.paddingRight = "12px";
  }
}


const leftScrolling = () => {
  inp.scrollLeft = inp.scrollWidth;  
}

const invalid = () => {
  inp.value = "Invalid Expression"
  inp.style.color = "red"
  inp.style.textAlign = "center"
  inp.style.paddingRight = "2px";
  setTimeout(()=>{
    inp.style.color = "white"
    inp.value = ""
    inp.style.textAlign = "end"
  }, 3000)  
}

const updateUI = () => {
  leftScrolling()
  inputHandling()
}