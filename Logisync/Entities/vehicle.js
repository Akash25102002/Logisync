{
  "name": "Vehicle",
  "type": "object",
  "properties": {
    "registration_number": {
      "type": "string",
      "title": "Registration Number"
    },
    "vehicle_type": {
      "type": "string",
      "enum": [
        "Truck",
        "Van",
        "Trailer",
        "Tanker",
        "Flatbed"
      ],
      "title": "Vehicle Type"
    },
    "make": {
      "type": "string",
      "title": "Make"
    },
    "model": {
      "type": "string",
      "title": "Model"
    },
    "year": {
      "type": "number",
      "title": "Year"
    },
    "capacity_tons": {
      "type": "number",
      "title": "Capacity (Tons)"
    },
    "fuel_type": {
      "type": "string",
      "enum": [
        "Diesel",
        "Petrol",
        "Electric",
        "CNG"
      ],
      "title": "Fuel Type"
    },
    "status": {
      "type": "string",
      "enum": [
        "Available",
        "In Transit",
        "Maintenance",
        "Out of Service"
      ],
      "title": "Status"
    },
    "mileage_km": {
      "type": "number",
      "title": "Mileage (KM)"
    },
    "last_service_date": {
      "type": "string",
      "format": "date",
      "title": "Last Service Date"
    },
    "insurance_expiry": {
      "type": "string",
      "format": "date",
      "title": "Insurance Expiry"
    },
    "image_url": {
      "type": "string",
      "title": "Vehicle Image"
    }
  },
  "required": [
    "registration_number",
    "vehicle_type",
    "status"
  ]
}