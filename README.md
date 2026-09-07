# StockPilot

StockPilot is a comprehensive inventory and order management system designed to help organizations streamline their supply chain operations. Built with modern web technologies, it provides a centralized platform for tracking stock levels, managing purchase orders, and overseeing sales fulfillment.

## Overview

Managing inventory across different channels and warehouses requires a system that is both reliable and intuitive. StockPilot offers a real-time dashboard and specialized modules to ensure businesses have complete visibility over their physical assets. 

Key features include:
- Inventory Management: Monitor real-time stock levels, categorize products, and set minimum stock alerts.
- Sales Orders: Create, track, and fulfill customer orders seamlessly from start to finish.
- Procurement: Manage purchase orders and receive shipments to keep inventory optimally stocked.
- Organization Workspaces: Multi-tenant architecture allowing different businesses to operate in their own secure environments.

## Tech Stack

The application is built using a decoupled architecture, ensuring scalability and ease of maintenance:

### Frontend
- Next.js: A React framework for building fast and robust user interfaces.
- Tailwind CSS: A utility-first CSS framework for highly customizable and responsive design.
- React Query: Data-fetching and state management library for seamless API integration.

### Backend
- FastAPI: A modern, high-performance web framework for building APIs with Python.
- PostgreSQL: A powerful, open-source object-relational database system for secure data storage.
- SQLAlchemy: The Python SQL toolkit and Object Relational Mapper that gives application developers the full power and flexibility of SQL.

## Getting Started

To run the application locally, you will need to set up both the backend API and the frontend client.

### Backend Setup
1. Navigate to the `backend` directory.
2. Install the required Python dependencies.
3. Configure your local environment variables, including the PostgreSQL database connection string.
4. Run the FastAPI development server.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install the necessary Node.js dependencies.
3. Configure your environment variables to point to the local backend API.
4. Start the Next.js development server.
