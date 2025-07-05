import { useState } from 'react';

export default function WeeksOfLife() {
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState(null);
  const [showHoverData, setShowHoverData] = useState(false);
  const [hoverWeek, setHoverWeek] = useState(null);
  
  const calculateStats = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    
    // Calculate weeks lived
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.floor((today - birthDate) / msInWeek);
    
    // Assuming average lifespan of ~80 years (4160 weeks)
    const totalWeeks = 4160;
    const weeksRemaining = totalWeeks - weeksLived;
    const percentageLived = Math.round((weeksLived / totalWeeks) * 100);
    
    // Calculate days lived
    const msInDay = 1000 * 60 * 60 * 24;
    const daysLived = Math.floor((today - birthDate) / msInDay);
    
    // Calculate hours slept (assuming 8 hours per day)
    const hoursSlept = Math.floor(daysLived * 8);
    
    // Calculate heartbeats (average 70 bpm)
    const heartbeats = Math.floor(daysLived * 24 * 60 * 70);
    
    // Calculate breaths (average 16 breaths per minute)
    const breaths = Math.floor(daysLived * 24 * 60 * 16);

    // Calculate seasons experienced
    const seasons = Math.floor(daysLived / 91.25);
    
    return {
      weeksLived,
      totalWeeks,
      weeksRemaining,
      percentageLived,
      daysLived,
      hoursSlept,
      heartbeats,
      breaths,
      seasons,
      birthYear
    };
  };
  
  // Helper functions for contextual statistics
  const getPopulationAtYear = (year) => {
    // World population estimates by year (in billions)
    const populationData = {
      1950: 2.5,
      1960: 3.0,
      1970: 3.7,
      1980: 4.4,
      1990: 5.3,
      2000: 6.1,
      2010: 6.9,
      2020: 7.8,
      2025: 8.1
    };
    
    // Find the closest year in our data
    const years = Object.keys(populationData).map(Number);
    const closestYear = years.reduce((prev, curr) => 
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );
    
    return Math.round(populationData[closestYear] * 1000000000);
  };
  
  const getAverageBirthsPerDay = () => {
    // Approximately 385,000 births per day globally (as of 2023)
    return 385000;
  };
  
  const getAverageDeathsPerDay = () => {
    // Approximately 166,000 deaths per day globally (as of 2023)
    return 166000;
  };

  const handleSubmit = () => {
    setStats(calculateStats(birthdate));
    setStep(2);
  };

  const getFormattedNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderWeekGrid = () => {
    if (!stats) return null;
    
    const rows = [];
    const weeksPerRow = 52;
    const totalRows = Math.ceil(stats.totalWeeks / weeksPerRow);
    
    for (let row = 0; row < totalRows; row++) {
      const weekCells = [];
      for (let col = 0; col < weeksPerRow; col++) {
        const weekNumber = row * weeksPerRow + col;
        if (weekNumber < stats.totalWeeks) {
          const isPast = weekNumber < stats.weeksLived;
          const isCurrent = weekNumber === stats.weeksLived;
          
          let cellClass = "w-2 h-2 m-0.5 rounded-sm transition-all ";
          if (isPast) {
            cellClass += "bg-gray-800 ";
          } else if (isCurrent) {
            cellClass += "bg-blue-500 animate-pulse ";
          } else {
            cellClass += "bg-gray-200 ";
          }
          
          weekCells.push(
            <div 
              key={weekNumber}
              className={cellClass}
              onMouseEnter={() => {
                setHoverWeek(weekNumber);
                setShowHoverData(true);
              }}
              onMouseLeave={() => setShowHoverData(false)}
            />
          );
        }
      }
      
      rows.push(
        <div key={row} className="flex">
          {weekCells}
        </div>
      );
    }
    
    return (
      <div className="mt-8 bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-lg font-normal mb-4 text-gray-800">Your life in weeks</h2>
        <div className="flex flex-col">
          {rows}
        </div>
        
        {showHoverData && (
          <div className="mt-4 text-sm text-gray-600">
            Week {hoverWeek + 1}: 
            {hoverWeek < stats.weeksLived ? 
              " A week from your past" : 
              hoverWeek === stats.weeksLived ? 
              " Your current week" : 
              " A week in your potential future"}
          </div>
        )}
        
        <div className="flex mt-6 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-gray-800 mr-2"></div>
            <span className="text-gray-600">Past</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 mr-2"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 mr-2"></div>
            <span className="text-gray-600">Future</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (!stats) return null;
    
    return (
      <div className="mt-8 space-y-6">
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">Life highlights</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You've lived <span className="text-gray-900 font-medium">{getFormattedNumber(stats.weeksLived)}</span> weeks, which is <span className="text-gray-900 font-medium">{stats.percentageLived}%</span> of a full life.
            </p>
            <p className="text-gray-600">
              That's <span className="text-gray-900 font-medium">{getFormattedNumber(stats.daysLived)}</span> days of experience and approximately <span className="text-gray-900 font-medium">{getFormattedNumber(stats.seasons)}</span> seasons observed.
            </p>
            <p className="text-gray-600">
              Your heart has beaten approximately <span className="text-gray-900 font-medium">{getFormattedNumber(stats.heartbeats)}</span> times.
            </p>
            <p className="text-gray-600">
              You've taken around <span className="text-gray-900 font-medium">{getFormattedNumber(stats.breaths)}</span> breaths and slept about <span className="text-gray-900 font-medium">{getFormattedNumber(stats.hoursSlept)}</span> hours.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">Societal context</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              During your lifetime, humanity's population has grown from {stats.birthYear ? <span className="text-gray-900 font-medium">{getFormattedNumber(getPopulationAtYear(stats.birthYear))}</span> : ""} to over <span className="text-gray-900 font-medium">8 billion</span> people.
            </p>
            <p className="text-gray-600">
              The average person will meet around <span className="text-gray-900 font-medium">80,000</span> people in their lifetime. You've likely already met approximately <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(80000 * (stats.percentageLived/100)))}</span> individuals.
            </p>
            <p className="text-gray-600">
              Since your birth, humanity has collectively experienced approximately <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(stats.daysLived * getAverageBirthsPerDay()))}</span> births and <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(stats.daysLived * getAverageDeathsPerDay()))}</span> deaths.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">Cosmic perspective</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Since your birth, Earth has traveled approximately <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(stats.daysLived * 1.6 * 1000000))}</span> kilometers through space around the Sun.
            </p>
            <p className="text-gray-600">
              The observable universe is about <span className="text-gray-900 font-medium">93 billion</span> light-years across, meaning light takes <span className="text-gray-900 font-medium">93 billion</span> years to cross it. Your entire lifespan is just <span className="text-gray-900 font-medium">{(80/13800000000 * 100).toFixed(10)}%</span> of the universe's age.
            </p>
            <p className="text-gray-600">
              During your lifetime, our solar system has moved about <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(stats.daysLived * 24 * 828000))}</span> kilometers through the Milky Way galaxy.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-normal mb-4 text-gray-800">Natural world</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You've experienced approximately <span className="text-gray-900 font-medium">{getFormattedNumber(Math.round(stats.daysLived / 29.53))}</span> lunar cycles and <span className="text-gray-900 font-medium">{getFormattedNumber(Math.floor(stats.daysLived / 365.25))}</span> trips around the Sun.
            </p>
            <p className="text-gray-600">
              A giant sequoia tree can live over 3,000 years. Your current age is <span className="text-gray-900 font-medium">{((stats.daysLived / 365.25) / 3000 * 100).toFixed(2)}%</span> of its potential lifespan.
            </p>
            <p className="text-gray-600">
              During your lifetime, your body has replaced most of its cells several times. You are not made of the same atoms you were born with.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setBirthdate('');
    setStats(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-normal text-gray-800 mb-2">Life in weeks</h1>
        <p className="text-gray-600 mb-8">A simple visualization to reflect on the passage of time</p>
        
        {step === 1 ? (
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-normal mb-4 text-gray-800">When were you born?</h2>
            <div>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-800"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                disabled={!birthdate}
              >
                Visualize your time
              </button>
            </div>
          </div>
        ) : (
          <>
            {renderWeekGrid()}
            {renderStats()}
            <button
              onClick={handleReset}
              className="mt-8 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}
