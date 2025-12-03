using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.API.Models
{
    public class User : Model
    {
        //[Required]
        //[ForeignKey("FK_UserType_Id")]
        //public int UserTypeId { get; set; }
        [Required]
        [StringLength(25)]
        public String FirstName { get; set; }
        [Required]
        [StringLength(25)]
        public String SecondName { get; set; }

        [ForeignKey("FK_UserManager_Id")]
        public int UserId { get; set; }


        //properties navigation
        public virtual Usercredentials Usercredentials { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual ICollection<Apraisal>? Apraisals { get; set; }
        public virtual ICollection<Questionary>? Questionaries { get; set; }

    }
}
