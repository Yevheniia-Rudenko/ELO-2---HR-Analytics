using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class Questionary: Model
    {
        [Required]
        [ForeignKey("FK_User_Id")]
        public int UserId { get; set; }

        [Required]
        public int EnvironmentSatisfaction { get; set; }

        [Required]
        public int JobSatisfaction { get; set; }

        [Required]
        public int RelationshipSatisfaction { get; set; }

        [Required]
        public int WorkLifeBalance { get; set; }

        public DateTime? Date { get; set; }

        //navigation properties
        virtual public User User { get; set; }
    }
}
