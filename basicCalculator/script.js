 document.addEventListener('DOMContentLoaded', () => {
            const display = document.getElementById('display');
            const buttons = document.querySelectorAll('.btn');
            const toggleHistoryBtn = document.getElementById('toggleHistory');
            const historyPanel = document.getElementById('historyPanel');
            const historyList = document.getElementById('historyList');
            let currentInput = '0';
            let previousValue = null;
            let operator = null;
            let waitingForSecondOperand = false;
            let calculationHistory = [];

            // Function to update the display
            function updateDisplay() {
                display.value = currentInput;
            }

            // Function to perform the calculation
            function calculate(first, second, op) {
                first = parseFloat(first);
                second = parseFloat(second);

                if (isNaN(first) || isNaN(second)) return second;

                let result;
                switch (op) {
                    case '+': result = first + second; break;
                    case '-': result = first - second; break;
                    case '*': result = first * second; break;
                    case '/': 
                        if (second === 0) {
                            return 'Error'; // Division by zero
                        }
                        result = first / second; 
                        break;
                    default: return second;
                }
                
                // Round to avoid floating point precision issues
                return Math.round(result * 100000000) / 100000000;
            }

            // Add calculation to history
            function addToHistory(expression, result) {
                calculationHistory.unshift({expression, result});
                if (calculationHistory.length > 5) {
                    calculationHistory.pop();
                }
                
                updateHistoryDisplay();
            }
            
            // Update history display
            function updateHistoryDisplay() {
                historyList.innerHTML = '';
                calculationHistory.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.textContent = `${item.expression} = ${item.result}`;
                    historyList.appendChild(historyItem);
                });
            }

            // Main function to handle button clicks (or keyboard input)
            function inputHandler(value) {
                if (value === 'C') {
                    // Handle Clear Screen
                    currentInput = '0';
                    previousValue = null;
                    operator = null;
                    waitingForSecondOperand = false;
                } else if (value === '=') {
                    // Handle Equals
                    if (operator && previousValue !== null) {
                        const expression = `${previousValue} ${operator} ${currentInput}`;
                        currentInput = calculate(previousValue, currentInput, operator);
                        addToHistory(expression, currentInput);
                        previousValue = null;
                        operator = null;
                        waitingForSecondOperand = true; // Ready for a new operation/input
                    }
                } else if (['+', '-', '*', '/'].includes(value)) {
                    // Handle Operators
                    const inputValue = currentInput;

                    if (previousValue === null) {
                        previousValue = inputValue;
                    } else if (waitingForSecondOperand) {
                        // Allows chaining operations without pressing '='
                        previousValue = inputValue;
                    } else {
                        const result = calculate(previousValue, inputValue, operator);
                        currentInput = String(result);
                        previousValue = String(result);
                    }

                    waitingForSecondOperand = true;
                    operator = value;
                } else if (['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
                    // Handle Numbers and Decimal
                    if (waitingForSecondOperand) {
                        currentInput = value;
                        waitingForSecondOperand = false;
                    } else {
                        if (value === '.' && currentInput.includes('.')) return; // Prevent multiple decimals
                        if (currentInput === '0' && value !== '.') {
                            currentInput = value;
                        } else {
                            currentInput += value;
                        }
                    }
                }
                updateDisplay();
            }

            // 1. Attach Button Listeners
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Add ripple effect
                    button.style.transform = 'translateY(1px)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                    
                    inputHandler(button.dataset.value);
                });
            });

            // 2. Add Keyboard Support
            document.addEventListener('keydown', (event) => {
                const key = event.key;
                
                // Map common keyboard keys to calculator actions
                if (/[0-9]/.test(key) || key === '.') {
                    inputHandler(key);
                } else if (['+', '-', '*', '/'].includes(key)) {
                    inputHandler(key);
                } else if (key === 'Enter' || key === '=') {
                    event.preventDefault(); // Prevent 'Enter' from clicking the last button
                    inputHandler('=');
                } else if (key === 'Delete' || key === 'c' || key === 'C' || key === 'Escape') {
                    inputHandler('C');
                }
            });

            // Toggle history panel
            toggleHistoryBtn.addEventListener('click', () => {
                if (historyPanel.style.display === 'block') {
                    historyPanel.style.display = 'none';
                    toggleHistoryBtn.innerHTML = '<i class="fas fa-history"></i> Show History';
                } else {
                    historyPanel.style.display = 'block';
                    toggleHistoryBtn.innerHTML = '<i class="fas fa-times"></i> Hide History';
                }
            });

            // Initial display update
            updateDisplay();
        });