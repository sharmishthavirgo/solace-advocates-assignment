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

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const filteredAdvocates = useMemo(() => {
    if (!searchTerm) {
      return advocates;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return advocates.filter((advocate) => {
      const { firstName, lastName, city, degree, specialties, yearsOfExperience, phoneNumber } = advocate;
      if (firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
          lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
          city.toLowerCase().includes(lowerCaseSearchTerm) ||
          degree.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      if (specialties.some(specialty => specialty.toLowerCase().includes(lowerCaseSearchTerm))) {
        return true;
      }
      if (yearsOfExperience.toString().includes(lowerCaseSearchTerm)) {
        return true;
      }
      if (phoneNumber.toString().includes(lowerCaseSearchTerm)) {
          return true;
      }
      return false;
    });
  }, [advocates, searchTerm]);

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
        <p className={styles.searchLabel}>Search</p>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>Degree</th>
                <th>Specialties</th>
                <th>Years of Experience</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => (
                <tr key={advocate.phoneNumber}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s, idx) => (
                      <div key={idx} className={styles.specialtyItem}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
