"use client";

import { driver } from "driver.js";
import { Button } from "../ui/button";
import { Route } from "lucide-react";
import { useEffect } from "react";

const TOUR_STORAGE_KEY = 'smarttulna_tour_completed_v2';

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
              onNextClick: (element, step, { movingTo }) => {
                if (movingTo === 'next') {
                    (document.getElementById('add-product-btn') as HTMLElement)?.click();
                    // Give dialog time to animate
                    setTimeout(() => driverObj.moveNext(), 400); 
                } else {
                    driverObj.moveNext();
                }
              }
          },
          {
            element: 'input[name="model"]',
            popover: {
                title: '2. Start with the Model',
                description: 'Enter the product\'s model number here. If another user has already added it, we will automatically fill in the public specs for you!',
                side: "bottom",
            }
          },
          {
            element: '#tour-attributes-toggle',
            popover: {
                title: '3. Contribute to the Community',
                description: 'You can add technical specifications like screen size or RAM. This information is shared publicly and helps everyone make better decisions.',
                side: "bottom",
            }
          },
          {
            element: '#tour-sellers-heading',
            popover: {
                title: '4. Track Prices',
                description: 'Add online seller links (which are public) and your private local quotes (which only you can see). This is the key to finding the best deal.',
                side: "top",
            }
          },
          { 
              element: '#product-list-container', 
              popover: { 
                  title: '5. See Your Products', 
                  description: 'After saving, your products will appear here. You can see key details and edit or delete them at any time.' 
              },
              onNextClick: (element, step, { movingTo }) => {
                if (movingTo === 'next') {
                    const closeButton = document.querySelector('button[aria-label="Close"]') as HTMLElement;
                    if (closeButton) {
                        closeButton.click();
                    }
                     // Give dialog time to animate out
                    setTimeout(() => driverObj.moveNext(), 400);
                } else {
                    driverObj.moveNext();
                }
              },
              onPrevClick: (element, step, { movingTo }) => {
                  if (movingTo === 'previous') {
                      (document.getElementById('add-product-btn') as HTMLElement)?.click();
                      setTimeout(() => driverObj.movePrevious(), 400);
                  } else {
                    driverObj.movePrevious();
                  }
              }
          },
          {
              element: '#main-compare-link',
              popover: {
                  title: '6. Compare Products',
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

  const driverObj = createDriver();

  useEffect(() => {
    try {
      const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      const productListExists = document.getElementById('product-list-container');
      
      if (tourCompleted !== 'true' && productListExists) {
        const timer = setTimeout(() => {
          driverObj.drive();
        }, 500); 
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to access localStorage for tour status.", e);
    }
  }, []);

  const handleStartTour = () => {
    driverObj.drive();
  }

  return (
    <Button variant="outline" onClick={handleStartTour}>
        <Route className="mr-2 h-4 w-4" />
        Start Tour
    </Button>
  );
}
