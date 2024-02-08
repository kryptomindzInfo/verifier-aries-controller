const proofJSON = {
  connection_id: "<Enter a valid Connection ID>",
  proof_request: {
    name: "Proof of Education",
    version: "1.0",
    requested_attributes: {
      "0_name_uuid": {
        name: "name",
        restrictions: [
          {
            cred_def_id: "<Enter a valid Credential Definition ID>",
          },
        ],
      },
      "0_date_uuid": {
        name: "date",
        restrictions: [
          {
            cred_def_id: "<Enter a valid Credential Definition ID>",
          },
        ],
      },
      "0_degree_uuid": {
        name: "degree",
        restrictions: [
          {
            cred_def_id: "<Enter a valid Credential Definition ID>",
          },
        ],
      },
      //   "0_self_attested_thing_uuid": {
      //     name: "self_attested_thing",
      //   },
    },
    requested_predicates: {
      "0_age_GE_uuid": {
        name: "birthdate_dateint",
        p_type: ">=",
        p_value: 18,
        restrictions: [
          {
            cred_def_id: "<Enter a valid Credential Definition ID>",
          },
        ],
      },
    },
  },
};

$(function () {
  var settings = {
    url: HOST + "/connections",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    let connections = response.results;
    for (let connection of connections) {
      if (connection.state == "active" || connection.state == "request") {
        $("#list-connections").append(
          $("<option>")
            .val(connection.connection_id)
            .text(connection.their_label + " " + connection.connection_id)
        );
      }
    }
  });

  $("#proofObject").val(JSON.stringify(proofJSON, null, 2));
});

$("#list-connections").on("change", function () {
  var connection_id = this.value;
  connection_id = connection_id || "<Enter a valid Connection ID>";
  var proof = JSON.parse($("#proofObject").val());
  proof.connection_id = connection_id;
  $("#proofObject").val(JSON.stringify(proof, null, 2));
});

$("#credentialDefinitionId").on("input", function () {
  var cred_def_id = this.value;
  var value = cred_def_id || "<Enter a valid Credential Definition ID>";
  var proof = JSON.parse($("#proofObject").val());
  Object.keys(proof.proof_request.requested_attributes)
    .filter(
      (attr) => proof.proof_request.requested_attributes[attr].restrictions
    )
    .forEach((attr) => {
      proof.proof_request.requested_attributes[
        attr
      ].restrictions[0].cred_def_id = value;
    });
  Object.keys(proof.proof_request.requested_predicates)
    .filter(
      (attr) => proof.proof_request.requested_predicates[attr].restrictions
    )
    .forEach((attr) => {
      proof.proof_request.requested_predicates[
        attr
      ].restrictions[0].cred_def_id = value;
    });
  $("#proofObject").val(JSON.stringify(proof, null, 2));
});

$("#req-proof-btn").on("click", function () {
  var proof_object = JSON.parse($("#proofObject").val());
  if (!proof_object) {
    return;
  }

  var settings = {
    url: HOST + "/present-proof/send-request",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(proof_object),
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    alert("Proof Request Sent.");
  });
});
