# Alpha-Dash : Dynamic Report Dashboard  

Deployed on Vercel - https://assignment.aradhya.site/

A professional-grade application designed to streamline file management and analysis. This project focuses on providing a feature-rich, user-friendly interface for organizing and analyzing local files, including CSV data.  

## Key Features  

### 1. **Local File Structure Parsing with Papa-Parser**  
Effortlessly access and parse local file structures using the powerful `papa-parser` library, enabling quick and responsive parsing of large CSV files without compromising performance.  

### 2. **Folder Flagging/Tagging System**  
Organize folders with a robust tagging and flagging system to enhance categorization and streamline data management. Users can easily assign tags to folders, enabling intuitive sorting and retrieval.  

### 3. **Customizable Dashboard**  
A highly customizable dashboard allows users to toggle folder visibility, ensuring a clutter-free interface. View only the folders you need for a personalized and efficient workspace.  

### 4. **Grid-based File Display with Pagination**  
Files are displayed in a structured, grid-like interface. Pagination ensures smooth navigation even with large datasets, providing a seamless browsing experience.  

### 5. **Advanced File Viewing with Ka-Table**  
The file viewing component leverages the powerful `Ka-table` library, enabling advanced functionalities like:  
   - **Group-by Columns**: Organize data hierarchically for better insights.  
   - **Sorting**: Sort data by any column for easy analysis.  
   - **Interactive Viewing**: View files in a clean and intuitive format.  

### 6. **Custom File Uploading and Parsing**  
Users can upload any CSV file via a dedicated file uploader. Once uploaded, the file is parsed using `papa-parser` and displayed in an `Ka-Table` component, where users can:  
   - **Sort Data**  
   - **Group Data by Columns**  
   - **Analyze the Data Interactively**  

## How to Recreate this Project  

### Prerequisites  
1. **Node.js and npm**: Install Node.js and npm on your system.  
2. **Code Editor**: Use any modern code editor like Visual Studio Code.  

### Steps  
1. **Clone the Repository**:  
   ```bash  
   git clone <repository_url>  
   cd <project_folder>
1. **Install dependencies**:  
   ```bash  
   npm install   

1. **Run the Project**:  
   ```bash  
   npm run dev  
