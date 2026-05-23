module.exports = {
  "name": "Driver",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Full Name"
    },
    "phone": {
      "type": "string",
      "title": "Phone Number"
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email"
    },
    "license_number": {
      "type": "string",
      "title": "License Number"
    },
    "license_expiry": {
      "type": "string",
      "format": "date",
      "title": "License Expiry"
    },
    "status": {
      "type": "string",
      "enum": [
        "Available",
        "On Trip",
        "Off Duty",
        "On Leave"
      ],
      "title": "Status"
    },
    "assigned_vehicle_id": {
      "type": "string",
      "title": "Assigned Vehicle ID"
    },
    "total_trips": {
      "type": "number",
      "title": "Total Trips"
    },
    "rating": {
      "type": "number",
      "title": "Rating"
    },
    "avatar_url": {
      "type": "string",
      "title": "Avatar"
    }
  },
  "required": [
    "name",
    "phone",
    "license_number",
    "status"
  ]
};