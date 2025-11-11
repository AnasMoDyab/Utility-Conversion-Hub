import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './Home';
import Currency from './pages/Currency';
import Weight from './pages/Weight';
import LengthPage from './pages/LengthPage';
import TemperaturePage from './pages/TemperaturePage';
import VolumePage from './pages/VolumePage';
import SpeedPage from './pages/SpeedPage';
import DateTimeTools from './pages/DateTimeTools';
import UnitPricePage from './pages/UnitPricePage';
import BMIPage from './pages/BMIPage';
import TipTaxPage from './pages/TipTaxPage';
import PercentagePage from './pages/PercentagePage';
import MathToolsPage from './pages/MathToolsPage';
import DataStoragePage from './pages/DataStoragePage';
import EnergyPage from './pages/EnergyPage';
import FuelEfficiencyPage from './pages/FuelEfficiencyPage';
import PressurePage from './pages/PressurePage';
import LoanPage from './pages/LoanPage';
import CurrencyTrendPage from './pages/CurrencyTrendPage';
import TaxSalaryPage from './pages/TaxSalaryPage';
import CookingPage from './pages/CookingPage';
import ScientificCalcPage from './pages/ScientificCalcPage';
import PhysicsPage from './pages/PhysicsPage';
import HexBinaryPage from './pages/HexBinaryPage';
import ColorConverterPage from './pages/ColorConverterPage';




function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/length" element={<LengthPage />} />
          <Route path="/temperature" element={<TemperaturePage />} />
          <Route path="/volume" element={<VolumePage />} />
          <Route path="/speed" element={<SpeedPage />} />
          <Route path="/datetime" element={<DateTimeTools />} />
          <Route path="/unit-price" element={<UnitPricePage />} />
          <Route path="/bmi" element={<BMIPage />} />
          <Route path="/tip-tax" element={<TipTaxPage />} />
          <Route path="/percentage" element={<PercentagePage />} />
          <Route path="/math" element={<MathToolsPage />} />
          <Route path="/data-storage" element={<DataStoragePage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/fuel" element={<FuelEfficiencyPage />} />
          <Route path="/pressure" element={<PressurePage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/currency-trend" element={<CurrencyTrendPage />} />
          <Route path="/tax-salary" element={<TaxSalaryPage />} />
          <Route path="/cooking" element={<CookingPage />} />
          <Route path="/scientific" element={<ScientificCalcPage />} />
          <Route path="/physics" element={<PhysicsPage />} />
          <Route path="/hex-binary" element={<HexBinaryPage />} />
          <Route path="/color" element={<ColorConverterPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
