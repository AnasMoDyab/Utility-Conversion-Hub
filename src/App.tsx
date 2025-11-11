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
import CalorieBurnPage from './pages/CalorieBurnPage';
import RandomToolsPage from './pages/RandomToolsPage';
import QRCodePage from './pages/QRCodePage';
import Base64Page from './pages/Base64Page';
import JSONToolsPage from './pages/JSONToolsPage';
import MarkdownPage from './pages/MarkdownPage';
import TextToolsPage from './pages/TextToolsPage';
import PasswordStrengthPage from './pages/PasswordStrengthPage';
import HashToolsPage from './pages/HashToolsPage';
import JokeQuotePage from './pages/JokeQuotePage';
import NameGeneratorPage from './pages/NameGeneratorPage';
import EmojiTranslatorPage from './pages/EmojiTranslatorPage';
import GamesPage from './pages/GamesPage';
import DevToolsIndex from './pages/DevToolsIndex';
import JsonCsvPage from './pages/dev/JsonCsvPage';
import RegexPage from './pages/dev/RegexPage';
import UuidJwtPage from './pages/dev/UuidJwtPage';
import DiffPage from './pages/dev/DiffPage';
import GradientPage from './pages/dev/GradientPage';
import ResponsiveUnitPage from './pages/dev/ResponsiveUnitPage';
import ApiPerfPage from './pages/dev/ApiPerfPage';
import CheatsPage from './pages/dev/CheatsPage';
import IconFinderPage from './pages/dev/IconFinderPage';





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
          <Route path="/calorie-burn" element={<CalorieBurnPage />} />
          <Route path="/random-tools" element={<RandomToolsPage />} />
          <Route path="/qr" element={<QRCodePage />} />
          <Route path="/base64" element={<Base64Page />} />
          <Route path="/json-tools" element={<JSONToolsPage />} />
          <Route path="/markdown" element={<MarkdownPage />} />
          <Route path="/text-tools" element={<TextToolsPage />} />
          <Route path="/password-strength" element={<PasswordStrengthPage />} />
          <Route path="/hash-tools" element={<HashToolsPage />} />
          <Route path="/joke-quote" element={<JokeQuotePage />} />
          <Route path="/name-gen" element={<NameGeneratorPage />} />
          <Route path="/emoji-translator" element={<EmojiTranslatorPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/dev-tools" element={<DevToolsIndex />} />
          <Route path="/dev/json-csv" element={<JsonCsvPage />} />
          <Route path="/dev/regex" element={<RegexPage />} />
          <Route path="/dev/uuid-jwt" element={<UuidJwtPage />} />
          <Route path="/dev/diff" element={<DiffPage />} />
          <Route path="/dev/gradient" element={<GradientPage />} />
          <Route path="/dev/responsive" element={<ResponsiveUnitPage />} />
          <Route path="/dev/api" element={<ApiPerfPage />} />
          <Route path="/dev/cheats" element={<CheatsPage />} />
          <Route path="/dev/icons" element={<IconFinderPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
