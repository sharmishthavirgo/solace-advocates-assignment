"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import styles from './Home.module.css';

type AdvocateType = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

type AdvocatesApiResponse = {
  data: AdvocateType[];
};

// Define the structure for a table column
// 'key' is a keyof AdvocateType to ensure type safety when accessing advocate properties
// 'render' is an optional function for custom cell rendering (e.g., for arrays like specialties)
type TableColumn = {
  header: string;
  key: keyof AdvocateType; // Use keyof to ensure it's a valid key from AdvocateType
  render?: (advocate: AdvocateType) => React.ReactNode; // Optional render function for complex cells
};

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define table columns
  // This array defines the order and content of your table columns
  const columns: TableColumn[] = useMemo(() => [
    { header: "First Name", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "City", key: "city" },
    { header: "Degree", key: "degree" },
    {
      header: "Specialties",
      key: "specialties",
      render: (advocate) => (
        advocate.specialties.map((s, idx) => (
          <div key={idx} className={styles.specialtyItem}>{s}</div>
        ))
      ),
    },
    { header: "Years of Experience", key: "yearsOfExperience" },
    { header: "Phone Number", key: "phoneNumber" },
  ], []); 

 
  useEffect(() => {
    const fetchAdvocates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/advocates/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse: AdvocatesApiResponse = await response.json();
        setAdvocates(jsonResponse.data);
      } catch (err) {
        console.error("Error fetching advocates:", err);
        setError("Failed to load advocates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  // Memoize the filtered advocates to prevent re-calculation on every render
  // unless advocates or searchTerm changes.
  const filteredAdvocates = useMemo(() => {
    if (!searchTerm) {
      return advocates; // If no search term, show all advocates
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return advocates.filter((advocate) => {
      for (const column of columns) {
        const value = advocate[column.key]; 

        if (Array.isArray(value)) { // Handle specialty array specifically
          if (value.some(item => String(item).toLowerCase().includes(lowerCaseSearchTerm))) {
            return true;
          }
        } else if (value !== undefined && value !== null) { // Handle other types (numbers, strings)
          if (String(value).toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
          }
        }
      }
      return false;
    });
  }, [advocates, searchTerm, columns]); // Add columns to dependency array because search logic depends on it

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  if (loading) {
    return (
      <main className={styles.main}>
        <h1 className={styles.heading}>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1 className={styles.heading}>Solace Advocates</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Solace Advocates</h1>
      <div className={styles.searchContainer}>
        <p>
          Searching for: <span className={styles.searchTermDisplay}>{searchTerm}</span>{" "}
        </p>
        <input
          type="text"
          className={styles.searchInput}
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder="Search by name, city, specialty..."
        />
        <button
          onClick={handleResetSearch}
          className={styles.resetButton}
        >
          Reset Search
        </button>
      </div>

      {filteredAdvocates.length === 0 && searchTerm !== "" ? (
        <p className={styles.noResultsMessage}>
          No advocates found matching your search term "{searchTerm}".
        </p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.advocatesTable}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => (
                <tr key={advocate.phoneNumber}>
                
                  {columns.map((column) => (
                    <td key={column.key}>
                     
                      {column.render ? column.render(advocate) : advocate[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}