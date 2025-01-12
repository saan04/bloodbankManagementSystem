# Blood Bank Management System API Documentation

Base URL: `http://localhost:8080/api`

## Donor Service Endpoints
### GET /donors
- **Description**: Retrieve all registered donors
- **Response**: List of donors

### GET /donors/{id}
- **Description**: Get donor by ID
- **Parameters**: `id` (path) - Donor ID
- **Response**: Donor details

### GET /donors/blood-group/{bloodGroup}
- **Description**: Get donors by blood group
- **Parameters**: `bloodGroup` (path) - Blood group type
- **Response**: List of donors with specified blood group

### GET /donors/eligible
- **Description**: Get all eligible donors for donation
- **Response**: List of eligible donors

### POST /donors
- **Description**: Register a new donor
- **Body**: Donor details
- **Response**: Created donor details

### PUT /donors/{id}
- **Description**: Update donor information
- **Parameters**: `id` (path) - Donor ID
- **Body**: Updated donor details
- **Response**: Updated donor information

### DELETE /donors/{id}
- **Description**: Delete a donor
- **Parameters**: `id` (path) - Donor ID
- **Response**: Success message

### POST /donors/{id}/donation
- **Description**: Record a blood donation for a donor
- **Parameters**: `id` (path) - Donor ID
- **Response**: Updated donor details

## Inventory Service Endpoints
### GET /inventory
- **Description**: Get all blood inventory
- **Response**: List of blood inventory items

### GET /inventory/{bloodGroup}
- **Description**: Get inventory for specific blood group
- **Parameters**: `bloodGroup` (path) - Blood group type
- **Response**: Blood inventory details

### GET /inventory/{bloodGroup}/check
- **Description**: Check blood availability
- **Parameters**: 
  - `bloodGroup` (path) - Blood group type
  - `quantity` (query) - Required quantity
- **Response**: Boolean availability status

### POST /inventory
- **Description**: Add new blood group to inventory
- **Body**: Blood inventory details
- **Response**: Created inventory details

### POST /inventory/{bloodGroup}/donate
- **Description**: Process blood donation
- **Parameters**: `bloodGroup` (path) - Blood group type
- **Body**: Donation details with quantity
- **Response**: Updated inventory

### POST /inventory/{bloodGroup}/request
- **Description**: Process blood request
- **Parameters**: `bloodGroup` (path) - Blood group type
- **Body**: Request details with quantity
- **Response**: Updated inventory

### GET /inventory/transactions
- **Description**: Get all blood transactions
- **Response**: List of transactions

### GET /inventory/transactions/type/{type}
- **Description**: Get transactions by type (DONATION/REQUEST)
- **Parameters**: `type` (path) - Transaction type
- **Response**: List of filtered transactions

### GET /inventory/low-stock
- **Description**: Check for low inventory items
- **Response**: List of blood groups with low stock

## Request Service Endpoints
### GET /requests
- **Description**: Get all blood requests
- **Response**: List of blood requests

### GET /requests/{id}
- **Description**: Get blood request by ID
- **Parameters**: `id` (path) - Request ID
- **Response**: Blood request details

### GET /requests/status/{status}
- **Description**: Get requests by status
- **Parameters**: `status` (path) - Request status
- **Response**: List of filtered requests

### GET /requests/hospital/{hospitalName}
- **Description**: Get requests by hospital
- **Parameters**: `hospitalName` (path) - Hospital name
- **Response**: List of requests from specified hospital

### POST /requests
- **Description**: Create new blood request
- **Body**: Blood request details
- **Response**: Created request details

### PUT /requests/{id}/status
- **Description**: Update request status
- **Parameters**: 
  - `id` (path) - Request ID
  - `status` (query) - New status
- **Response**: Updated request details

### GET /requests/emergency
- **Description**: Process emergency blood requests
- **Response**: List of processed emergency requests

### GET /requests/date-range
- **Description**: Get requests within date range
- **Parameters**: 
  - `start` (query) - Start date-time
  - `end` (query) - End date-time
- **Response**: List of filtered requests
