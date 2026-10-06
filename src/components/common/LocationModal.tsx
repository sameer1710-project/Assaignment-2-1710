import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { City } from '../../types';
import { MapPin, X, Check, Navigation, Building2 } from 'lucide-react';

const POPULAR_CITIES: { city: City; state: string; popularAreas: string[] }[] = [
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    popularAreas: ['Kelambakkam', 'Navalur', 'Siruseri', 'Sholinganallur', 'OMR Road', 'T. Nagar', 'Adyar', 'Velachery'],
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    popularAreas: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Electronic City'],
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    popularAreas: ['Hitec City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Kondapur'],
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    popularAreas: ['Bandra West', 'Powai', 'Andheri East', 'Lower Parel', 'Juhu', 'Colaba'],
  },
  {
    city: 'Delhi',
    state: 'Delhi NCR',
    popularAreas: ['Connaught Place', 'Saket', 'Hauz Khas', 'Vasant Kunj', 'Greater Kailash', 'Dwarka'],
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    popularAreas: ['Koregaon Park', 'Viman Nagar', 'Kothrud', 'Baner', 'Hinjewadi', 'Kalyani Nagar'],
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    popularAreas: ['Park Street', 'Salt Lake', 'New Town', 'Ballygunge', 'Alipore'],
  },
  {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    popularAreas: ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Race Course'],
  },
];

export const LocationModal: React.FC = () => {
  const {
    city: currentCity,
    area: currentArea,
    setDeliveryLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
  } = useApp();

  const [selectedCity, setSelectedCity] = useState<City>(currentCity);
  const [customArea, setCustomArea] = useState<string>('');

  if (!isLocationModalOpen) return null;

  const currentCityData = POPULAR_CITIES.find((c) => c.city === selectedCity) || POPULAR_CITIES[0];

  const handleSelectArea = (area: string) => {
    setDeliveryLocation(selectedCity, area);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customArea.trim()) {
      setDeliveryLocation(selectedCity, customArea.trim());
      setCustomArea('');
    }
  };

  const handleUseCurrentLocation = () => {
    // Simulated instant GPS detection
    setDeliveryLocation('Chennai', 'Kelambakkam (Current GPS)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Choose Delivery Location</h3>
              <p className="text-xs text-slate-500">Discover restaurants delivering to your exact area</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick GPS button */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-amber-500/30 bg-amber-50/50 hover:bg-amber-100/50 text-amber-700 font-semibold text-sm transition-colors"
          >
            <Navigation className="w-4 h-4 fill-amber-600 text-amber-600" />
            <span>Use current location (GPS)</span>
          </button>

          {/* Select City */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select City
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_CITIES.map((item) => {
                const isSelected = selectedCity === item.city;
                return (
                  <button
                    key={item.city}
                    onClick={() => setSelectedCity(item.city)}
                    className={`py-2 px-3 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{item.city}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Area / Landmark Input */}
          <form onSubmit={handleCustomSubmit}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Enter Area, Street or Landmark
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`e.g. OMR Road, ${selectedCity}`}
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!customArea.trim()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Set
              </button>
            </div>
          </form>

          {/* Popular Areas in City */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Popular Neighborhoods in {selectedCity}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCityData.popularAreas.map((areaName) => {
                const isActive = currentCity === selectedCity && currentArea === areaName;
                return (
                  <button
                    key={areaName}
                    onClick={() => handleSelectArea(areaName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {areaName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Currently set to:</span>
          <span className="font-semibold text-slate-800">
            {currentArea}, {currentCity}
          </span>
        </div>
      </div>
    </div>
  );
};
