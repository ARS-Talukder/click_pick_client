import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
    // This hook is only for the debounced search. That means autofill search
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;