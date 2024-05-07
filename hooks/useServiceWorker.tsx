import { useEffect } from "react";
import toast from 'react-hot-toast';

function useServiceWorker() {
    useEffect(() => {
        async function registerServiceWorker() {
            if ('serviceWorker' in navigator){
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();

                    if (registrations.length) {
                        for (let i = 1; i < registrations.length; i++){
                            registrations[i].unregister();
                            console.log('unregistered service worker', registrations[i]);
    
                        }
                    }else {
                        const registration = await navigator.serviceWorker.register(
                            '/sw.js'
                        )
                        console.log(
                            "Service Worker registered with scope:",
                            registration.scope
                          );
                    }
                    const registration = await navigator.serviceWorker.ready;
                    console.log("Service Worker ready:", registration);


                    if (registration) {
                        registration.onupdatefound = () => {
                          const installingWorker = registration?.installing;
                          if (installingWorker) {
                            installingWorker.onstatechange = () => {
                              if (installingWorker.state === "installed") {
                                toast.success(
                                  "New update available! Please refresh page to update."
                                );
                              }
                            };
                          }
                        };
                }
            }catch (error) {
                console.error("Service Worker registration failed:", error);

            }
        }
    }
    registerServiceWorker();
}, []);
}

export default useServiceWorker;


