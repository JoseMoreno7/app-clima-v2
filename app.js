let useCelsius = true;

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Por favor ingresa una ciudad");
    return;
  }
  
  const apiKey = "03eab9350ff618d9987958741bdfb968";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`;

  try {
    // Mostrar loader y ocultar otros elementos
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("weatherResult").classList.add("hidden");
    document.getElementById("errorMessage").classList.add("hidden");

    const response = await fetch(url);
    if (!response.ok) throw new Error("Ciudad no encontrada");

    const data = await response.json();
    mostrarClima(data);
  } catch (error) {
    document.getElementById("errorMessage").classList.remove("hidden");
    console.error("Error:", error);
  } finally {
    document.getElementById("loader").classList.add("hidden");
  }
}

function mostrarClima(data) {
  const ciudad = `${data.name}, ${data.sys.country}`;
  const icono = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  const descripcion = data.weather[0].description;
  const detalles = `Humedad: ${data.main.humidity}% | Viento: ${data.wind.speed} m/s`;
  
  // Temperaturas para conversión
  const tempCelsius = data.main.temp;
  const tempFahrenheit = (tempCelsius * 9/5) + 32;

  document.getElementById("cityName").textContent = ciudad;
  document.getElementById("weatherIcon").src = icono;
  document.getElementById("weatherIcon").alt = descripcion;
  document.getElementById("description").textContent = descripcion;
  document.getElementById("details").textContent = detalles;
  
  // Mostrar según unidad seleccionada
  updateTemperatureDisplay(tempCelsius, tempFahrenheit);

  document.getElementById("weatherResult").classList.remove("hidden");
}

function toggleTemperatureUnit() {
  useCelsius = !useCelsius;
  const tempElement = document.getElementById("temperature");
  if (tempElement.dataset.celsius && tempElement.dataset.fahrenheit) {
    updateTemperatureDisplay(
      parseFloat(tempElement.dataset.celsius),
      parseFloat(tempElement.dataset.fahrenheit)
    );
  }
  // Actualizar texto del botón
  document.getElementById("unitToggle").textContent = useCelsius ? "°C / °F" : "°F / °C";
}

function updateTemperatureDisplay(celsius, fahrenheit) {
  const tempElement = document.getElementById("temperature");
  tempElement.dataset.celsius = celsius;
  tempElement.dataset.fahrenheit = fahrenheit;
  
  tempElement.textContent = useCelsius 
    ? `${celsius.toFixed(1)}°C` 
    : `${fahrenheit.toFixed(1)}°F`;
}

// Footer - Año automático
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Opcional: Buscar clima al presionar Enter
  document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather();
  });
});