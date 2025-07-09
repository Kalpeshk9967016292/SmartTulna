"use client";

import { driver } from "driver.js";
import { Button } from "../ui/button";
import { Route } from "lucide-react";
import { useEffect } from "react";

export function TourGuide() {

  const handleStartTour = () => {
    const driverObj = driver({
        showProgress: true,
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

    driverObj.drive();
  }

  return (
    <Button variant="outline" onClick={handleStartTour}>
        <Route className="mr-2 h-4 w-4" />
        Start Tour
    </Button>
  );
}
