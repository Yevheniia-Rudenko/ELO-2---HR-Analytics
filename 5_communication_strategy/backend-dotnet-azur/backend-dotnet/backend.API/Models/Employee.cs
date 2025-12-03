using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class Employee: Model
    {
        [Required]
        [ForeignKey("FK_User_Id")]
        public int UserId { get; set; }

        [Required]
        // Calcuate from Birthday
        public int Age { get; set; }

        public bool Attrition { get; set; }

        [Required]
        [StringLength(25)]
        public string BusinessTravel { get; set; }

        [Required]
        public int DailyRate { get; set; }

        [Required]
        [StringLength(25)]
        public string Department { get; set; }

        [Required]
        public int DistanceFromHome { get; set; }

        public int Education { get; set; }

        [StringLength(256)]
        public int EducationField { get; set; }


        //navigation properties
        virtual public User User { get; set; }
    }
}
