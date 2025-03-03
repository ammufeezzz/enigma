const levels = [
    { distance: 111, targetHeight: 0, hiddenTransform: (speed) => speed - 7, tolerance: 5 },
    { distance: 194, targetHeight: 30, hiddenTransform: (speed) => speed + 23, tolerance: 5 },
    { distance: 116, targetHeight: 0, hiddenTransform: (cosTheta) => cosTheta - 0.1, tolerance: 5 },
    { distance: 142, targetHeight: 40, hiddenTransform: (cosTheta) => cosTheta + 0.05, tolerance: 5 },
];

let currentLevel = 0;

function updateUI() {
    const level = levels[currentLevel];
    document.getElementById("targetDistance").textContent = level.distance;
    document.getElementById("targetHeight").textContent = level.targetHeight || "-";
    document.getElementById("processedDistance").textContent = "-";
    document.getElementById("missedPoint").textContent = "-";
}

document.getElementById("submitBtn").addEventListener("click", () => {
    const inputCode = document.getElementById("codeEditor").value;
    
    let userSpeed, userCosTheta;
    try {
        const userFunction = new Function("speed, cosTheta", `${inputCode}\nreturn { speed, cosTheta };`);
        const result = userFunction();
        userSpeed = result.speed;
        userCosTheta = result.cosTheta;
    } catch (error) {
        alert("Invalid input! Ensure your JavaScript syntax is correct.");
        return;
    }

    const level = levels[currentLevel];
    let actualSpeed, actualCosTheta;
    
    if (typeof level.hiddenTransform(userSpeed) === "number") {
        actualSpeed = level.hiddenTransform(userSpeed);
        actualCosTheta = Math.cos(userCosTheta * Math.PI / 180); 
    } else {
        actualCosTheta = level.hiddenTransform(Math.cos(userCosTheta * Math.PI / 180));
        actualSpeed = userSpeed;
    }

    const g = 9.8;
    const timeOfFlight = (2 * actualSpeed * Math.sin(Math.acos(actualCosTheta))) / g;
    const range = actualSpeed * actualCosTheta * timeOfFlight;

    document.getElementById("processedDistance").textContent = range.toFixed(2);

    if (Math.abs(range - level.distance) <= level.tolerance) {
        alert("Success! Target hit!");
        currentLevel++;
        if (currentLevel < levels.length) {
            updateUI();
        } else {
            alert("Game completed!");
        }
    } else {
        const h0 = level.targetHeight;
        const intersectionX = (actualSpeed * actualCosTheta / g) * (actualSpeed * Math.sin(Math.acos(actualCosTheta)) + Math.sqrt((actualSpeed * Math.sin(Math.acos(actualCosTheta))) ** 2 + 2 * g * h0));
        document.getElementById("missedPoint").textContent = intersectionX.toFixed(2);
        alert("Missed! Try again.");
    }
});

updateUI();