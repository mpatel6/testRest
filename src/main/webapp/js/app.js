//causes code to execute immediately when it loads
(function ($, window, document) {
    $(function () {
        //PRIVATE PROPERTIES
        var rootURL = "http://localhost:8080/testRest/api/v1/";
        var currentAuthor;

        var $tbody = $('tbody');

        //PRIVATE FUNCTIONS
        findAllAuthors();

        function findAllAuthors() {
            //optional: debugging javascript
            console.log('findAllAuthors');
            $('#addUpdateAuthor').hide();
            $.ajax({
                type: 'GET',
                url: rootURL + "authors",
                dataType: 'json',
                success: renderList,
                error: function (jqXHR, testStatus, errorThrown) {
                    alert("Could not get all authors due to: " + errorThrown.toString());
                }
            });
        }

        function renderList(authorList) {
            // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
            // Not necessary as above we have error check. Either it comes as empty or with some records
            $('tbody tr').remove();
            $.each(authorList, function (index, author) {
                $tbody.append('<tr id= "'+rootURL+"authors"+'/'+author.authorId+'"><td>' + author.authorId + '</td><td>' + author.authorName + '</td><td>' + author.dateCreated + '</td><td><button class="deleteButton" value="' + author.authorId + '">delete</button>' + '</td></tr>');
            });
        }


        $('tbody').on('click', '.deleteButton', function () {
            console.log('deleteauthor');
            $.ajax({
                type: 'DELETE',
                url: rootURL + 'authors/' + $(this).val(),
                success: function (data, textStatus, jqXHR) {
                    alert('Author deleted successfully');

                    findAllAuthors();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('delete author error');
                }
            });
        });

        $('#btnAddNewAuthor').click(function () {
            $('#addUpdateAuthor').show();
            addNewAuthor();
            return false;
        });
        function addNewAuthor() {
            currentAuthor = {};
            renderAuthorDetails(currentAuthor);
        }

        $('#btnSave').click(function () {
              if ($('#authorId').val() == '')
            addAuthor();
              else
            updateAuthor();
            return false;
        });

        function addAuthor() {
            console.log(formToJSON());
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: rootURL + "authors",
                dataType: "json",
                data: formToJSON(),
                success: function (data, textStatus, jqXHR) {
                    alert('Author Added successfully');
                    findAllAuthors();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.status);
                    // Fix a bug in JQuery: 201 means the insert succeeded!
                    if (jqXHR.status === 201 || jqXHR.status === 200) {
                        alert('Author created successfully');
                        findAllAuthors();
                    }
                    else {
                        alert('addAuthor error: ' + textStatus);
                    }
                }
            });
        }
        
        function updateAuthor() {
    console.log('updateAuthor');
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: rootURL + "authors"+'/' + $('#authorId').val(),
        dataType: "html",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR) {
            alert('Author updated successfully');
            findAllAuthors();            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('updateAuthor error: ' + textStatus);
        }
    });

}

        function formToJSON() {
            return JSON.stringify({
                "authorId": $('#authorId').val(),
                "authorName": $('#authorName').val(),
                "dateCreated": $('#dateCreated').val(),
            });
        }

        $('tbody').on('click', 'tr', function () {
            $('#addUpdateAuthor').show();
            console.log('from row click')
            var dataLink = $(this).attr('id');
            console.log(dataLink);
            findById($(this).attr('id'));
        });

        function findById(self) {
            console.log(self);
            $.ajax({
                type: 'GET',
                url: self,
                dataType: "json",
                success: function (data, textstatus) {
                    console.log('findById success: ' + data.name);
                    currentAuthor = data;
                    renderAuthorDetails(currentAuthor);
                }
            });
        }

        function renderAuthorDetails(author) {
            if (author.name === undefined) {
                $('#authorId').val(author.authorId);
            } else {
                var id = author.authorId;
                $('#authorId').val(id);
            }
            $('#authorName').val(author.authorName);
            $('#dateCreated').val(author.dateCreated);
           
        }
    });

}(window.jQuery, window, document));