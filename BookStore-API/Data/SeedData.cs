using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace BookStore_API.Data
{
    public static class SeedData
    {
        private static async Task SeedUsers(UserManager<IdentityUser> userManager)
        {
            if (await userManager.FindByEmailAsync("admin@bookstore.com") == null)
            {
                var user = new IdentityUser
                {
                    UserName = "admin",
                    Email = "admin@bookstore.com",

                };
                var result = await userManager.CreateAsync(user, "P@ssword1");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Administrator");
                }
            }

            if (await userManager.FindByEmailAsync("ewbbud@gmail.com") == null)
            {
                var user = new IdentityUser
                {
                    UserName = "bud",
                    Email = "ewbbud@gmail.com",

                };
                var result = await userManager.CreateAsync(user, "B^ddenberg2763");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Auditor");
                }
            }
            if (await userManager.FindByEmailAsync("customer@bookstore.com") == null)
            {
                var user = new IdentityUser
                {
                    UserName = "customer",
                    Email = "customer@bookstore.com",

                };
                var result = await userManager.CreateAsync(user, "P@ssword1");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Customer");
                }
            }
        }

        private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync("Administrator"))
            {
                var role = new IdentityRole
                {
                    Name = "Administrator"
                };
                var result = roleManager.CreateAsync(role).Result;
            }

            if (!await roleManager.RoleExistsAsync("Customer"))
            {
                var role = new IdentityRole
                {
                    Name = "Customer"
                };
                var result = roleManager.CreateAsync(role).Result;
            }

            if (!await roleManager.RoleExistsAsync("Auditor"))
            {
                var role = new IdentityRole
                {
                    Name = "Auditor"
                };
                var result = roleManager.CreateAsync(role).Result;
            }
        }

        public static async Task Seed(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
           await SeedRoles(roleManager);
           await SeedUsers(userManager);
        }
    }
}
