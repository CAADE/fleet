.. _SubSystem-Hardware-Stack:

Hardware Stack
==============

Hardware Stack is a subsystem of fleet. It represents the hardware in the data center. There are
three types of hardware (storage, network, compute).

Use Cases
---------

* :ref:`UseCase-Manage-Hardware`

.. image:: UseCases.png

Users
-----

* :ref:`Ops-Manager`

.. image:: UserInteraction.png

Uses
----

* :ref:`Hardware-Stack`

Interface
---------

* CLI - Command Line Interface
* REST-API -
* Portal - Web Portal

Logical Artifacts
-----------------

* Hardware - Represents the type of hardware in the data center (compute, storage, network)

.. image:: Logical.png

Activities and Flows
--------------------

Basic Workflow of working with hardware.

.. image::  Process.png

Deployment Architecture
-----------------------

The fleet application is deployed with the default database for a sailsjs application.
A CLI is defined in the bin directory.

.. image:: Deployment.png

Physical Architecture
---------------------

There are three interfaces to the Hardware Stack subsystem. CLI, Web, and REST. The CLI communicates
with the Cloud Stack via the REST interface. All REST interfaces are accessible via a CLI. The Web interface
utilizes the sails.io subsystem to have a web interface that is interaction with the sailsj application without
pooling (COMET).

.. image:: Physical.png

