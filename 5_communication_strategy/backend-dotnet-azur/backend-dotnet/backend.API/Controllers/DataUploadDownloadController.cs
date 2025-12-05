using backend.API.Data;
using backend.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataUploadDownloadController : ControllerBase
    {
        private readonly backendAPIContext _context;

        public DataUploadDownloadController(backendAPIContext context)
        {
            _context = context;
        }

        // POST: api/DataMigration/upload
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream, Encoding.UTF8);

            // Read header line
            var headerLine = await reader.ReadLineAsync();
            if (string.IsNullOrEmpty(headerLine))
                return BadRequest("CSV file is empty.");

            int importedCount = 0;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line)) continue;

                var values = line.Split(',');

                // Defensive check: skip malformed rows
                if (values.Length < 36) continue;

                string firstName = values[35];
                string lastName = values[36];
                int? managerId = int.TryParse(values[37], out var manIdVal) ? manIdVal : null;

                Employee manager = await _context.Employee.Where(e => e.EmployeeNumber == managerId).FirstOrDefaultAsync();

                // Create User
                var user = new User
                {
                    //FirstName = values[35],
                    //LastName = values[36],
                    //ManagerId = string.IsNullOrWhiteSpace(values[37]) ? null : int.Parse(values[36])


                    FirstName = firstName,
                    LastName = lastName,
                    ManagerId = manager.UserId
                };

                _context.User.Add(user);
                await _context.SaveChangesAsync();

                // Create Employee linked to User
                var employee = new Employee
                {
                    UserId = user.Id,
                    Age = int.TryParse(values[0], out var age) ? age : null,
                    Attrition = values[1],
                    BusinessTravel = values[2],
                    DailyRate = int.TryParse(values[3], out var dailyRate) ? dailyRate : null,
                    Department = values[4],
                    DistanceFromHome = int.TryParse(values[5], out var dist) ? dist : null,
                    Education = int.TryParse(values[6], out var edu) ? edu : null,
                    EducationField = values[7],
                    EmployeeCount = int.TryParse(values[8], out var empCount) ? empCount : null,
                    EmployeeNumber = int.TryParse(values[9], out var empNum) ? empNum : 0,
                    Gender = values[11],
                    HourlyRate = int.TryParse(values[12], out var hr) ? hr : null,
                    JobLevel = int.TryParse(values[14], out var jl) ? jl : null,
                    JobRole = values[15],
                    MaritalStatus = values[17],
                    MonthlyIncome = int.TryParse(values[18], out var mi) ? mi : null,
                    MonthlyRate = int.TryParse(values[19], out var mr) ? mr : null,
                    NumCompaniesWorked = int.TryParse(values[20], out var ncw) ? ncw : null,
                    Over18 = string.IsNullOrEmpty(values[21]) ? null : values[21][0],
                    OverTime = values[22],
                    PercentSalaryHike = int.TryParse(values[23], out var psh) ? psh : null,
                    StandardHours = int.TryParse(values[26], out var sh) ? sh : null,
                    StockOptionLevel = int.TryParse(values[27], out var sol) ? sol : null,
                    TotalWorkingYears = int.TryParse(values[28], out var twy) ? twy : null,
                    TrainingTimesLastYear = int.TryParse(values[29], out var tty) ? tty : null,
                    YearsAtCompany = int.TryParse(values[31], out var yac) ? yac : null,
                    YearsInCurrentRole = int.TryParse(values[32], out var ycr) ? ycr : null,
                    YearsSinceLastPromotion = int.TryParse(values[33], out var yslp) ? yslp : null,
                    YearsWithCurrManager = int.TryParse(values[34], out var ywcm) ? ywcm : null
                };
                
                _context.Employee.Add(employee);
                

                // Create Questionary linked to User
                if (values[10] != null &
                    values[16] != null &
                    values[25] != null &
                    values[30] != null)
                {
                    var questionary = new Questionary
                    {
                        UserId = user.Id,
                        EnvironmentSatisfaction = int.Parse(values[10]),
                        JobSatisfaction = int.Parse(values[16]),
                        RelationshipSatisfaction = int.Parse(values[25]),
                        WorkLifeBalance = int.Parse(values[30])
                    };

                    _context.Questionary.Add(questionary);
                }

                // Create Apraisal linked to User
                if (values[13] != null &
                    values[24] != null &
                    values[37] != null &
                    values[37] != "")
                {
                    //var managerValue = values[37];
                    //int managerId = int.Parse(managerValue);
                    //Employee manager = await _context.Employee.Where(e => e.EmployeeNumber == managerId).FirstOrDefaultAsync();

                    var apraisal = new Apraisal
                    {
                        ManagerId = manager.UserId,
                        SubordinateId = user.Id,
                        JobInvolvement = int.Parse(values[13]),
                        PerformanceRating = int.Parse(values[24])
                    };

                    _context.Apraisal.Add(apraisal);
                }

                await _context.SaveChangesAsync();
                importedCount++;
            }

            await _context.SaveChangesAsync();

            return Ok($"{importedCount} records migrated successfully.");
        }

        // GET: api/DataMigration/download
        [HttpGet("download")]
        public async Task<IActionResult> Download()
        {
            var employees = await _context.Employee.Include(e => e.User).ToListAsync();
            var questionaries = await _context.Questionary.Include(q => q.User).ToListAsync();
            var apraisals = await _context.Apraisal
                .Include(a => a.Manager)
                .Include(a => a.Subordinate)
                .ToListAsync();

            var sb = new StringBuilder();

            // --- Employees ---
            sb.AppendLine("EmployeeId,FirstName,LastName,Age,Attrition,BusinessTravel,Department,JobRole,MonthlyIncome");
            foreach (var e in employees)
            {
                sb.AppendLine($"{e.Id},{e.User?.FirstName},{e.User?.LastName},{e.Age},{e.Attrition},{e.BusinessTravel},{e.Department},{e.JobRole},{e.MonthlyIncome}");
            }

            sb.AppendLine(); // blank line between sections

            // --- Questionaries ---
            sb.AppendLine("QuestionaryId,UserId,EnvironmentSatisfaction,JobSatisfaction,RelationshipSatisfaction,WorkLifeBalance,Date");
            foreach (var q in questionaries)
            {
                sb.AppendLine($"{q.Id},{q.UserId},{q.EnvironmentSatisfaction},{q.JobSatisfaction},{q.RelationshipSatisfaction},{q.WorkLifeBalance},{q.Date}");
            }

            sb.AppendLine();

            // --- Apraisals ---
            sb.AppendLine("ApraisalId,ManagerId,SubordinateId,JobInvolvement,PerformanceRating,Date");
            foreach (var a in apraisals)
            {
                sb.AppendLine($"{a.Id},{a.ManagerId},{a.SubordinateId},{a.JobInvolvement},{a.PerformanceRating},{a.Date}");
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var output = new MemoryStream(bytes);

            return File(output, "text/csv", "HR_Download.csv");
        }
    }
}
