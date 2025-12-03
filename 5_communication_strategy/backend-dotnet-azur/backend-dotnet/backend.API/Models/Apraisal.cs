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
        [ForeignKey("FK_Employee_Id")]
        public int EmployeeId { get; set; }

        [Required]
        public int JobInvolvement { get; set; }

        [Required]
        public int PerformanceRating { get; set; }

        public DateTime? Date { get; set; }

        //navigation properties
        virtual public User Publisher { get; set; }
        virtual public User Subscriber { get; set; }




    
    }
}
