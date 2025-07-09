"use client";

import { driver } from "driver.js";
import { Button } from "../ui/button";
import { Route } from "lucide-react";
import { useEffect } from "react";

const TOUR_STORAGE_KEY = 'smarttulna_tour_completed';

export function TourGuide() {

  const createDriver = () => {
    return driver({
      showProgress: true,
      onClose: () => {
        try {
          // When the tour is closed or finished, set the flag in localStorage
          localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        } catch (e) {
          console.error("Failed to save tour status to localStorage", e);
        }
      },
      steps: [
          { 
              element: '#add-product-btn', 
              popover: { 
                  title: 'Add a Product', 
                  description: 'Click here to add a new product to your personal list.' 
              } 
          },
          { 
              element: '#product-list-container', 
              popover: { 
                  title: 'Your Product Cards', 
                  description: 'Your saved products will appear here. You can see key details at a glance.' 
              } 
          },
          {
              element: '#main-compare-link',
              popover: {
                  title: 'Compare Products',
                  description: 'After adding a few products, click here to see a detailed side-by-side comparison.'
              }
          },
          { 
              popover: { 
                  title: 'You\'re All Set!', 
                  description: 'That\'s it! You now know the basics of SmartTulna. Enjoy comparing!' 
              } 
          }
      ]
    });
  }

  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      if (tourCompleted !== 'true') {
        // Use a small timeout to ensure all DOM elements are mounted
        const timer = setTimeout(() => {
          createDriver().drive();
        }, 500); 
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to access localStorage for tour status.", e);
    }
  }, []);

  const handleStartTour = () => {
    createDriver().drive();
  }

  return (
    <Button variant="outline" onClick={handleStartTour}>
        <Route className="mr-2 h-4 w-4" />
        Start Tour
    </Button>
  );
}
