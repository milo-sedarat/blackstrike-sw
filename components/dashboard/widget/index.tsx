"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TVNoise from "@/components/ui/tv-noise";
import type { WidgetData } from "@/types/dashboard";
import Image from "next/image";

interface UserLocation {
  city: string;
  region: string;
  country: string;
  timezone: string;
  temperature?: string;
  weather?: string;
}

export default function Widget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get user location from IP address
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setUserLocation({
          city: data.city || 'Unknown',
          region: data.region || '',
          country: data.country_name || 'Unknown',
          timezone: data.timezone || 'UTC',
          temperature: '72°F',
          weather: 'Clear'
        });
      } catch (error) {
        console.error('Failed to get user location:', error);
        // Fallback to default data
        setUserLocation({
          city: 'Unknown',
          region: '',
          country: 'Unknown',
          timezone: 'UTC',
          temperature: '72°F',
          weather: 'Clear'
        });
      } finally {
        setIsLoading(false);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: !is24Hour,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const restOfDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { dayOfWeek, restOfDate };
  };

  const handleWidgetClick = () => {
    setIs24Hour(!is24Hour);
  };

  const dateInfo = formatDate(currentTime);

  // Get timezone offset for display
  const getTimezoneDisplay = () => {
    if (!userLocation) return 'UTC';
    
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Get location display
  const getLocationDisplay = () => {
    if (!userLocation) return 'Unknown Location';
    
    if (userLocation.region && userLocation.region !== userLocation.city) {
      return `${userLocation.city}, ${userLocation.region}`;
    }
    return `${userLocation.city}, ${userLocation.country}`;
  };

  return (
    <Card 
      className="w-full aspect-[2] relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]" 
      onClick={handleWidgetClick}
    >
      <TVNoise opacity={0.3} intensity={0.2} speed={40} />
      <CardContent className="bg-accent/30 flex-1 flex flex-col justify-between text-sm font-medium uppercase relative z-20">
        <div className="flex justify-between items-center">
          <span className="opacity-50">{dateInfo.dayOfWeek}</span>
          <span>{dateInfo.restOfDate}</span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-display" suppressHydrationWarning>
            {formatTime(currentTime)}
          </div>
          {isLoading && (
            <div className="text-xs opacity-50 mt-1">Loading location...</div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="opacity-50">
            {isLoading ? 'Loading...' : (userLocation?.temperature || '72°F')}
          </span>
          <span>
            {isLoading ? 'Loading...' : getLocationDisplay()}
          </span>

          <Badge variant="secondary" className="bg-accent">
            {isLoading ? 'Loading...' : getTimezoneDisplay()}
          </Badge>
        </div>

        <div className="absolute inset-0 -z-[1]">
          <Image
            src="/assets/pc_blueprint.gif"
            alt="logo"
            width={250}
            height={250}
            className="size-full object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}
