﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Models;

namespace backend.Migrations.Sheep
{
    [DbContext(typeof(SheepContext))]
    [Migration("20220315110841_addPreditor")]
    partial class addPreditor
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.13")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("backend.Models.DeadSheepPositionData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Color")
                        .HasColumnType("int");

                    b.Property<bool>("Dead")
                        .HasColumnType("bit");

                    b.Property<int>("IdTour")
                        .HasColumnType("int");

                    b.Property<double>("Latitude")
                        .HasColumnType("float");

                    b.Property<double>("Longitude")
                        .HasColumnType("float");

                    b.Property<int>("Preditor")
                        .HasColumnType("int");

                    b.Property<int>("Size")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeOfObservation")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("IdTour");

                    b.ToTable("DeadSheepPositions");
                });

            modelBuilder.Entity("backend.Models.Sheep", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Name")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Sheep");
                });

            modelBuilder.Entity("backend.Models.SheepPositionData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("BigBlackSheep")
                        .HasColumnType("int");

                    b.Property<int>("BigBrownSheep")
                        .HasColumnType("int");

                    b.Property<int>("BigWhiteSheep")
                        .HasColumnType("int");

                    b.Property<int>("IdTour")
                        .HasColumnType("int");

                    b.Property<double>("Latitude")
                        .HasColumnType("float");

                    b.Property<double>("Longitude")
                        .HasColumnType("float");

                    b.Property<int>("SmallBlackSheep")
                        .HasColumnType("int");

                    b.Property<int>("SmallBrownSheep")
                        .HasColumnType("int");

                    b.Property<int>("SmallWhiteSheep")
                        .HasColumnType("int");

                    b.Property<int>("TieBlue")
                        .HasColumnType("int");

                    b.Property<int>("TieGreen")
                        .HasColumnType("int");

                    b.Property<int>("TieRed")
                        .HasColumnType("int");

                    b.Property<int>("TieYellow")
                        .HasColumnType("int");

                    b.Property<DateTime>("TimeOfObsevation")
                        .HasColumnType("datetime2");

                    b.Property<int>("TotalNumberOfSheep")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("IdTour");

                    b.ToTable("SheepPositions");
                });

            modelBuilder.Entity("backend.Models.TourData", b =>
                {
                    b.Property<int>("IdTour")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Start")
                        .HasColumnType("datetime2");

                    b.HasKey("IdTour");

                    b.ToTable("Tours");
                });

            modelBuilder.Entity("backend.Models.TourLocationData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("IdTour")
                        .HasColumnType("int");

                    b.Property<double>("Latitude")
                        .HasColumnType("float");

                    b.Property<double>("Longitude")
                        .HasColumnType("float");

                    b.Property<DateTime>("TimePosition")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("IdTour");

                    b.ToTable("TourLocations");
                });

            modelBuilder.Entity("backend.Models.DeadSheepPositionData", b =>
                {
                    b.HasOne("backend.Models.TourData", "Tour")
                        .WithMany("DeadSheepPositions")
                        .HasForeignKey("IdTour")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tour");
                });

            modelBuilder.Entity("backend.Models.SheepPositionData", b =>
                {
                    b.HasOne("backend.Models.TourData", "Tour")
                        .WithMany("SheepPositions")
                        .HasForeignKey("IdTour")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tour");
                });

            modelBuilder.Entity("backend.Models.TourLocationData", b =>
                {
                    b.HasOne("backend.Models.TourData", "Tour")
                        .WithMany("Positions")
                        .HasForeignKey("IdTour")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Tour");
                });

            modelBuilder.Entity("backend.Models.TourData", b =>
                {
                    b.Navigation("DeadSheepPositions");

                    b.Navigation("Positions");

                    b.Navigation("SheepPositions");
                });
#pragma warning restore 612, 618
        }
    }
}
