﻿using Microsoft.EntityFrameworkCore;

namespace Mission11.Data
{
    public class BookContext : DbContext
    {
        public BookContext(DbContextOptions<BookContext> options) : base(options)
        { 
        }

        public DbSet<Book> Books { get; set; }

    }
}
