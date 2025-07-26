"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

// Type for an individual advocate
type AdvocateType = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

//API response type
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
        console.log("Fetching advocates...");
        const response = await fetch("/api/advocates/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse: AdvocatesApiResponse = await response.json();
        console.log("Advocates data:", jsonResponse.data);
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
      return advocates;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return advocates.filter((advocate) => {
      const {
        firstName,
        lastName,
        city,
        degree,
        specialties,
        yearsOfExperience,
        phoneNumber,
      } = advocate;

      if (
        firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        city.toLowerCase().includes(lowerCaseSearchTerm) ||
        degree.toLowerCase().includes(lowerCaseSearchTerm)
      ) {
        return true;
      }

      if (
        specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowerCaseSearchTerm)
        )
      ) {
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleResetSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  if (loading) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term-display">{searchTerm}</span>{" "}
        </p>
        <input
          type="text" 
          style={{ border: "1px solid black", padding: "8px" }}
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder="Search by name, city, specialty..."
        />
        <button
          onClick={handleResetSearch}
          style={{ marginLeft: "10px", padding: "8px 12px", cursor: "pointer" }}
        >
          Reset Search
        </button>
      </div>
      <br />
      <br />
      {filteredAdvocates.length === 0 && searchTerm !== "" ? (
        <p>No advocates found matching your search term {searchTerm}.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            {/* CORRECTED HTML STRUCTURE: <th> elements are now inside a <tr> */}
            <tr style={{ background: "#f2f2f2" }}>
              <th style={tableHeaderStyle}>First Name</th>
              <th style={tableHeaderStyle}>Last Name</th>
              <th style={tableHeaderStyle}>City</th>
              <th style={tableHeaderStyle}>Degree</th>
              <th style={tableHeaderStyle}>Specialties</th>
              <th style={tableHeaderStyle}>Years of Experience</th>
              <th style={tableHeaderStyle}>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => (
              <tr key={advocate.phoneNumber}>
                <td style={tableCellStyle}>{advocate.firstName}</td>
                <td style={tableCellStyle}>{advocate.lastName}</td>
                <td style={tableCellStyle}>{advocate.city}</td>
                <td style={tableCellStyle}>{advocate.degree}</td>
                <td style={tableCellStyle}>
                  {advocate.specialties.map((s, idx) => (
                    <div key={idx}>{s}</div>
                  ))}
                </td>
                <td style={tableCellStyle}>{advocate.yearsOfExperience}</td>
                <td style={tableCellStyle}>{advocate.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

// Basic inline styles for table.
const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
};

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};
