let currentValue = '0';
let currentExpression = '0';
let valueHasChanged = false;
let hasCalculated = false;
let operators = [];
let operatorIndex = 0;
let numbers = [];
let valueIndex = 0;
let error = false;

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	if (b == 0) {
		error = true;
		currentExpression = "ERROR";

		throw "Divided by 0";
	}

	return a / b;
}

function operate(operator, a, b) {
	return operator(a, b);
}

function updateDisplay() {
	const display = document.getElementById("display");
	display.setAttribute("value", currentExpression);
}

function insertValue(value) {
	if (error) {
		currentValue = currentExpression = '0';
		error = false;
	}

	if (hasCalculated && operators.length === 0) {
		currentValue = String(value);
		currentExpression = currentValue;
	} else if (value === '.') {
		if (!currentValue.includes('.')) {
			currentExpression = currentExpression.concat(value);
			currentValue = currentValue.concat(value);
		}
	} else if (currentValue.startsWith('0')) {
		if (currentValue.includes('.')) {
			currentExpression = currentExpression.concat(value);
			currentValue = currentValue.concat(value);
		} else {
			currentValue = String(value);
			currentExpression = currentExpression.substr(0, currentExpression.length - 1) + currentValue;
		}
	} else {
		currentExpression = currentExpression.concat(value);
		currentValue = currentValue.concat(value);
	}

	valueHasChanged = true;
	hasCalculated = false;

	updateDisplay();
}

function clearValue() {
	currentValue = currentExpression = '0';

	updateDisplay();
}

function operatorToString(operator) {
	if (operator == add) {
		return '+';
	} else if (operator == subtract) {
		return '-';
	} else if (operator == multiply) {
		return '×';
	} else {
		return '÷';
	}
}

function insertOperator(operator) {
	if (currentExpression == '0') {
		valueHasChanged = true;
	}

	if (valueHasChanged || hasCalculated) {
		operators[operatorIndex] = operator;
		operatorIndex++;

		numbers[valueIndex] = Number(currentValue);
		valueIndex++;

		currentValue = '';
		currentExpression += ` ${operatorToString(operator)} `;
		valueHasChanged = false;
	} else {		
		currentExpression = currentExpression.substr(0, currentExpression.length - 3) + ` ${operatorToString(operator)} `;
		operators[operatorIndex - 1] = operator;
	}

	updateDisplay();
}

function deleteLastValue() {
	if (currentValue.length === 1) {
		currentValue = '0';
		currentExpression = currentExpression.substr(0, currentExpression.length - 1) + '0';
	} else {
		currentValue = currentValue.substr(0, currentValue.length - 1);
		currentExpression = currentExpression.substr(0, currentExpression.length - 1);
	}

	updateDisplay();
}

function calculate() {
	if (operators.length === 0) {
		return;
	}

	numbers[valueIndex] = Number(currentValue);
	let value;

	for (let i = 0; i < operators.length; i++) {
		let operator = operatorToString(operators[i]);

		if (operator == '×' || operator == '÷') {
			try {
				value = operate(operators[i], numbers[i], numbers[i + 1]);
			} catch (e) {
				break;
			}
			
			if (!Number.isInteger(value)) {
				value = Math.fround(value).toFixed(2);
			}
			
			numbers[i] = value;
			numbers.splice(i + 1, 1);

			operators.splice(i, 1);
		}
	}

	if (!error) {
		for (let i = 0; i < operators.length; i++) {
			value = operate(operators[i], numbers[i], numbers[i + 1]);
			
			if (!Number.isInteger(value)) {
				value = Math.fround(value).toFixed(2);
			}

			numbers[i + 1] = value;
		}
	}

	operatorIndex = valueIndex = 0;
	operators = [];
	numbers = [];
	valueHasChanged = false;
	hasCalculated = true;

	if (!error) {
		currentValue = currentExpression = String(value);
	}

	updateDisplay();
}