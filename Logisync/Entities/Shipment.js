module.exports = {
  "name": "Shipment",
  "type": "object",
  "properties": {
    "tracking_id": {
      "type": "string",
      "title": "Tracking ID"
    },
    "origin": {
      "type": "string",
      "title": "Origin (Plant/Warehouse)"
    },
    "destination": {
      "type": "string",
      "title": "Destination"
    },
    "status": {
      "type": "string",
      "enum": [
        "Pending",
        "Dispatched",
        "In Transit",
        "Delivered",
        "Cancelled"
      ],
      "title": "Status"
    },
    "priority": {
      "type": "string",
      "enum": [
        "Low",
        "Medium",
        "High",
        "Urgent"
      ],
      "title": "Priority"
    },
    "vehicle_id": {
      "type": "string",
      "title": "Vehicle ID"
    },
    "driver_id": {
      "type": "string",
      "title": "Driver ID"
    },
    "cargo_description": {
      "type": "string",
      "title": "Cargo Description"
    },
    "weight_tons": {
      "type": "number",
      "title": "Weight (Tons)"
    },
    "scheduled_departure": {
      "type": "string",
      "format": "date-time",
      "title": "Scheduled Departure"
    },
    "scheduled_arrival": {
 