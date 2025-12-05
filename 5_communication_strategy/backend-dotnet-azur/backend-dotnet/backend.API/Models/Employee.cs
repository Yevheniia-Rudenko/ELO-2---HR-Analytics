using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class Employee: Model
    {
        [Required]
        [ForeignKey("FK_User_Id")]
        public int UserId { get; set; }

 
        // Calcuate from Birthday
        public int? Age { get; set; }

        [Required]
        public string Attrition { get; set; }
        //public bool Attrition { get; set; }

        [StringLength(25)]
        public string? BusinessTravel { get; set; }

         public int? DailyRate { get; set; }

        [StringLength(25)]
        public string? Department { get; set; }

         public int? DistanceFromHome { get; set; }

        public int? Education { get; set; }

        [StringLength(64)]
        public string? EducationField { get; set; }

      
        public int? EmployeeCount { get; set; }
        public int EmployeeNumber { get; set; }
        [StringLength(8)]
        public string? Gender { get; set; }
        public int? HourlyRate { get; set; }
        public int? JobLevel { get; set; }
        [StringLength(16)]
        public string? JobRole { get; set; }
        [StringLength(8)]
        public string? MaritalStatus { get; set; }
        public int? MonthlyIncome { get; set; }
        public int? MonthlyRate { get; set; }
        public int? NumCompaniesWorked { get; set; }
        public char? Over18 { get; set; }
        [StringLength(4)]
        public string? OverTime { get; set; }
        //public bool? OverTime { get; set; }
        public int? PercentSalaryHike { get; set; }
        public int? StandardHours { get; set; }
        public int? StockOptionLevel { get; set; }
        public int? TotalWorkingYears { get; set; }
        public int? TrainingTimesLastYear { get; set; }
        public int? YearsAtCompany { get; set; }
        public int? YearsInCurrentRole { get; set; }
        public int? YearsSinceLastPromotion { get; set; }
        public int? YearsWithCurrManager { get; set; }


        //navigation properties
        virtual public User? User { get; set; }
    }
}
