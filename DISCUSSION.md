# Improvemements on backend if I had more time
Server-Side Filtering (Absolute Must-Have):

The current frontend filteredAdvocates logic assumes all advocates are loaded client-side. With hundreds of thousands, the backend API must accept search parameters (e.g., /api/advocates?q=searchTerm&city=Atlanta) and filter the data at the database level before sending it to the client.

Benefit: Reduces network payload size, leverages database efficiency, prevents browser overload.

Server-Side Pagination (Absolute Must-Have):

The backend API must support pagination parameters (e.g., /api/advocates?page=1&limit=20). This prevents the backend from querying and sending all 100k+ records.

Benefit: Dramatically reduces network payload, backend processing load, and frontend rendering load.

Caching: Caching frequently accessed query results (e.g., with Redis). For example, if "Atlanta" is searched often, cache the results.

Benefit: Reduces database load and API response times for common queries.

# Improvemements on frontend if I had more time
Refine UI/UX elements: Adding a simple loading spinner, better error styling, and styling for the "no results" message in Home.module.css and basic responsiveness. Also design the site better

Implement Debouncing: Add the debounce logic to  Home.tsx for the search input.