#!/bin/bash

# Prompt user for new values
read -p "Enter new DB Username: " NEW_DB_USERNAME
read -p "Enter new DB Password: " NEW_DB_PASSWORD
read -p "Enter new DB Name: " NEW_DB_NAME
read -p "Enter new APP_URL (leave blank for default http://localhost): " NEW_APP_URL

# Set default APP_URL if empty
if [ -z "$NEW_APP_URL" ]; then
    NEW_APP_URL="http://localhost"
fi

# Get list of API directories
API_DIRS=$(ls -d api_*)

# Loop through each API directory
for DIR in $API_DIRS; do
    ENV_FILE="$DIR/.env"
    
    if [ -f "$ENV_FILE" ]; then
        echo "Updating .env in $DIR..."
        
        # Update DB credentials
        sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$NEW_DB_USERNAME/" "$ENV_FILE"
        sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$NEW_DB_PASSWORD/" "$ENV_FILE"
        sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$NEW_DB_NAME/" "$ENV_FILE"

        # Ensure APP_URL is updated or added if missing
        if grep -q "^APP_URL=" "$ENV_FILE"; then
            sed -i "s|^APP_URL=.*|APP_URL=$NEW_APP_URL|" "$ENV_FILE"
        else
            echo "APP_URL=$NEW_APP_URL" >> "$ENV_FILE"
        fi

        echo "Updated .env in $DIR."
    else
        echo "No .env file found in $DIR. Skipping..."
    fi
done

echo "Update process completed."
