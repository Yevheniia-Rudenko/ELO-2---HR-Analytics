using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.API.Models
{
    public class Apraisal: Model
    {
        [Required]
        [ForeignKey("FK_Manager_Id")]
        public int ManagerId { get; set; }

        [Required]
        [ForeignKey("FK_Subordinate_Id")]
        public int SubordinateId { get; set; }

        [Required]
        public int JobInvolvement { get; set; }

        [Required]
        public int PerformanceRating { get; set; }

        public DateTime? Date { get; set; }

        //navigation properties
        virtual public User Manager { get; set; }
        virtual public User Subordinate { get; set; }
    }
}
