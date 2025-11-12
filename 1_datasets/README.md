# Datasets

This folder contains all data used in the HR Analytics project.

## Structure

```text
1_datasets/
├── raw_data/        # Original, unmodified data files
├── cleaned_data/    # Processed and cleaned datasets
└── README.md        # This file
```

## Raw Data

The `raw_data/` folder contains:

- Original CSV files
- Excel spreadsheets
- JSON files
- Any other source data formats

**Important:** Never modify files in `raw_data/` directly. Always work with copies.

## Cleaned Data

The `cleaned_data/` folder contains:

- Processed datasets ready for analysis
- Data with missing values handled
- Normalized and standardized data
- Feature-engineered datasets

## Data Documentation

For each dataset, document:

- **Source** - Where the data came from
- **Description** - What the data contains
- **Size** - Number of rows and columns
- **Date** - When the data was collected
- **License** - Data usage rights
- **Variables** - Description of each column

## Data Dictionary

Create a `data_dictionary.md` file describing all variables in your datasets.

## Best Practices

- Never commit large files (>100MB) to Git
- Use `.gitignore` to exclude data files if needed
- Store large datasets externally (Google Drive, etc.)
- Document all data transformations
- Keep track of data versions
