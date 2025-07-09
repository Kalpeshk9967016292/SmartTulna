"use client";

import { driver } from "driver.js";
import { Button } from "../ui/button";
import { Route } from "lucide-react";
import { useEffect } from "react";

const TOUR_STORAGE_KEY = 'smarttulna_tour_completed_v2'; // Changed key to reset for existing users

export function TourGuide() {

  const createDriver = () => {
    return driver({
      showProgress: true,
      onClose: () => {
        try {
          localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        } catch (e) {
          console.error("Failed to save tour status to localStorage", e);
        }
      },
      steps: [
          { 
              element: '#add-product-btn', 
              popover: { 
                  title: '1. Add a Product', 
                  description: 'Let\'s start by adding a new product to your personal list. I\'ll open the form for you.'
              },
              onNextClick: () => {
                // Programmatically open the form for the next step
                (document.getElementById('add-product-btn') as HTMLElement)?.click();
                createDriver().moveNext();
              }
          },
          {
            element: 'form', // Target the form inside the now-open dialog
            popover: {
                title: '2. Fill in the Details',
                description: 'Enter the product name and model. If the model exists in our public database, we\'ll autofill specs for you! You can also add sellers here.'
            },
            onPrevClick: () => {
                // If user goes back, close the dialog
                document.querySelector('button[aria-label="Close"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                createDriver().movePrevious();
            }
          },
          { 
              element: '#product-list-container', 
              popover: { 
                  title: '3. See Your Products', 
                  description: 'Your saved products will appear here. You can see key details and edit or delete them at any time.' 
              },
              onNextClick: () => {
                // Close the dialog if it's open before moving on
                const closeButton = document.querySelector('button[aria-label="Close"]') as HTMLElement;
                if (closeButton) {
                    closeButton.click();
                }
                createDriver().moveNext();
              }
          },
          {
              element: '#main-compare-link',
              popover: {
                  title: '4. Compare Products',
                  description: 'After adding a few products, click here to see a detailed side-by-side comparison of prices and features.'
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
      // Only run tour if there are products to avoid pointing at an empty space
      const productListExists = document.getElementById('product-list-container');
      
      if (tourCompleted !== 'true' && productListExists) {
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
